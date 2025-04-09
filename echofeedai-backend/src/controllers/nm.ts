import { Request, Response } from "express";
import client from "../db/client";
import { mailTemplateSchema, sendMailToParticipantsSchema } from "../types";
import transporter from "../utils/nm/transporter";

const getVariablesFromBody = (body: string) => {
  const regex = /{{(.*?)}}/g;
  const matches = body.match(regex);
  return matches ? matches.map((match) => match.replace(/[{}]/g, "")) : [];
};

const checkTemplate = async (variables: string[], body: string) => {
  try {
    const expectedVariables = getVariablesFromBody(body);
    if (expectedVariables.length !== variables.length) {
      return {
        isValid: false,
        message: "Number of variables in body and template do not match",
      };
    }

    const missingVariables = [];
    for (const variable of variables) {
      if (!expectedVariables.includes(variable)) {
        missingVariables.push(variable);
      }
    }

    if (missingVariables.length > 0) {
      return {
        isValid: false,
        message: `Variables ${missingVariables.join(", ")} not found in body`,
      };
    }

    return {
      isValid: true,
      message: "Template is valid",
    };
  } catch (error) {
    console.error("Check template error:", error);
    return {
      isValid: false,
      message: "Failed to check template",
    };
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const parsedTemplate = mailTemplateSchema.safeParse(req.body);

    if (!parsedTemplate.success) {
      res.status(400).json({
        message: "Invalid template",
        payload: null,
      });
      return;
    }

    // Check if template with identifier already exists
    const existingTemplate = await client.mailTemplate.findUnique({
      where: { identifier: parsedTemplate.data.identifier },
    });

    if (existingTemplate) {
      res.status(409).json({
        message:
          "Template with this identifier already exists, try updating it instead",
        payload: null,
      });
      return;
    }

    // Check if template is valid
    const checkTemplateResult = await checkTemplate(
      parsedTemplate.data.variables,
      parsedTemplate.data.body
    );

    if (!checkTemplateResult.isValid) {
      res.status(400).json({
        message: checkTemplateResult.message,
        payload: null,
      });
      return;
    }

    // Create template
    const template = await client.mailTemplate.create({
      data: {
        identifier: parsedTemplate.data.identifier,
        subject: parsedTemplate.data.subject,
        variables: parsedTemplate.data.variables,
        body: parsedTemplate.data.body,
      },
    });

    res.status(201).json({
      message: "Template created successfully",
      payload: template,
    });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({
      message: "Failed to create template",
      payload: null,
    });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    // Check if template exists

    const parsedTemplate = mailTemplateSchema.safeParse(req.body);

    if (!parsedTemplate.success) {
      res.status(400).json({
        message: "Invalid template",
        payload: null,
      });
      return;
    }

    const { identifier } = parsedTemplate.data;
    const existingTemplate = await client.mailTemplate.findUnique({
      where: { identifier },
    });

    if (!existingTemplate) {
      res.status(404).json({
        message: "Template not found",
        payload: null,
      });
      return;
    }

    const checkTemplateResult = await checkTemplate(
      parsedTemplate.data.variables,
      parsedTemplate.data.body
    );

    if (!checkTemplateResult.isValid) {
      res.status(400).json({
        message: checkTemplateResult.message,
        payload: null,
      });
      return;
    }

    // Update template
    const template = await client.mailTemplate.update({
      where: { identifier },
      data: {
        subject: parsedTemplate.data.subject,
        variables: [...parsedTemplate.data.variables],
        body: parsedTemplate.data.body,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Template updated successfully",
      payload: template,
    });
    return;
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({
      message: "Failed to update template",
      payload: null,
    });
    return;
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    // Check if template exists
    const existingTemplate = await client.mailTemplate.findUnique({
      where: { identifier },
    });

    if (!existingTemplate) {
      res.status(404).json({
        message: "Template not found",
        payload: null,
      });
      return;
    }

    // Delete template
    await client.mailTemplate.delete({
      where: { identifier },
    });

    res.status(200).json({
      message: "Template deleted successfully",
      payload: null,
    });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({
      message: "Failed to delete template",
      payload: null,
    });
  }
};

export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await client.mailTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Templates retrieved successfully",
      payload: templates,
    });
  } catch (error) {
    console.error("Get all templates error:", error);
    res.status(500).json({
      message: "Failed to retrieve templates",
      payload: null,
    });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      res.status(400).json({
        message: "Identifier is required",
        payload: null,
      });
      return;
    }
    const template = await client.mailTemplate.findUnique({
      where: { identifier },
    });

    if (!template) {
      res.status(404).json({
        message: "Template not found",
        payload: null,
      });
      return;
    }

    res.status(200).json({
      message: "Template retrieved successfully",
      payload: template,
    });
    return;
  } catch (error) {
    console.error("Get template by id error:", error);
    res.status(500).json({
      message: "Failed to retrieve template",
      payload: null,
    });
    return;
  }
};

const sendMail = async (
  templateIdentifier: string,
  recipientEmail: string,
  variableValues: Record<string, string>
) => {
  try {
    // [TODO] Implement email sending logic here
    // This would involve:
    // 1. Replacing variables in template with provided values
    // 2. Using an email service (like nodemailer) to send the email
    // 3. Possibly logging the email send attempt
    const template = await client.mailTemplate.findUnique({
      where: { identifier: templateIdentifier },
    });
    if (!template) {
      throw new Error("Template not found");
    }
    

    const mailTransporter = transporter;
    const mailOptions = {
      from: "noreply@echo.com",
      to: recipientEmail,
      subject: template.subject,
      html: template.body,
    };
    
    const mailResult = await mailTransporter.sendMail(mailOptions);
    console.log("mail sent", mailResult);
    console.log(
      "mail sent",
      templateIdentifier,
      recipientEmail,
      variableValues
    );
    return {
      isValid: true,
      message: "Email sent successfully",
      payload: {
        templateIdentifier,
        recipientEmail,
        variableValues,
      },
    };
  } catch (error) {
    console.error("Send mail error:", error);
    return {
      isValid: false,
      message: "Failed to send email",
    };
  }
};

export const sendMailToParticipants = async (req: Request, res: Response) => {
  try {
    const parsedSendMail = sendMailToParticipantsSchema.safeParse(req.body);

    if (!parsedSendMail.success) {
      res.status(400).json({
        message: "Invalid request",
        payload: null,
      });
      return;
    }

    const { templateIdentifier, participantIds } = parsedSendMail.data;

    // Get the template
    const template = await client.mailTemplate.findUnique({
      where: { identifier: templateIdentifier },
    });

    if (!template) {
      res.status(404).json({
        message: "Template not found",
        payload: null,
      });
      return;
    }

    // Get the participants
    const participants = await client.participant.findMany({
      where: { id: { in: participantIds } },
    });

    if (participants.length !== participantIds.length) {
      res.status(404).json({
        message: "Participants not found",
        payload: null,
      });
      return;
    }

    // Send the email to the participants
    for (const participant of participants) {
      // [TODO]: Think of better way to handle variable values
      await sendMail(template.identifier, participant.email, {});
    }

    res.status(200).json({
      message: "Emails sent successfully [TODO]",
      payload: null,
    });
  } catch (error) {
    console.error("Send mail to participants error:", error);
    res.status(500).json({
      message: "Failed to send email",
      payload: null,
    });
  }
};
