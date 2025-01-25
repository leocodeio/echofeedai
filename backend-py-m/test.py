import torch
import sys
import psutil
import platform
from models.groq import GroqModel

def get_gpu_info():
    """Get GPU information if available"""
    if torch.cuda.is_available():
        gpu_info = {
            "gpu_available": True,
            "gpu_count": torch.cuda.device_count(),
            "current_device": torch.cuda.current_device(),
            "device_name": torch.cuda.get_device_name(0),
            "memory_allocated": f"{torch.cuda.memory_allocated(0)/1024**2:.2f} MB",
            "memory_cached": f"{torch.cuda.memory_reserved(0)/1024**2:.2f} MB",
            "max_memory": f"{torch.cuda.get_device_properties(0).total_memory/1024**2:.2f} MB"
        }
    else:
        gpu_info = {
            "gpu_available": False,
            "error": "No GPU available"
        }
    return gpu_info

def get_system_info():
    """Get general system information"""
    return {
        "python_version": sys.version,
        "platform": platform.platform(),
        "processor": platform.processor(),
        "ram_total": f"{psutil.virtual_memory().total/1024**3:.2f} GB",
        "ram_available": f"{psutil.virtual_memory().available/1024**3:.2f} GB",
        "ram_used": f"{psutil.virtual_memory().used/1024**3:.2f} GB",
        "ram_percentage": f"{psutil.virtual_memory().percent}%"
    }

def main():
    # Get GPU information
    gpu_info = get_gpu_info()
    print("\n=== GPU Information ===")
    for key, value in gpu_info.items():
        print(f"{key}: {value}")

    # Get system information
    system_info = get_system_info()
    print("\n=== System Information ===")
    for key, value in system_info.items():
        print(f"{key}: {value}")

if __name__ == "__main__":
    main()