Database design

Manager

- id
- name
- email
- password
- created_at
- updated_at

User

- id
- email
- accepted
- created_at
- updated_at

Source

- id
- name
- description
- metadata
  - requirements
- created_at
- updated_at

Feedback

- id
- manager_id
- source_id
- list ( user_id )
- created_at
- updated_at

FeedbackResponse

- id
- user_id
- feedback_id
- response
- created_at
- updated_at