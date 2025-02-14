import os
import shutil
from pathlib import Path

class ModelStorage:
    def __init__(self, base_path="models/files"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def save_model_file(self, file, filename):
        """Save uploaded model file"""
        file_path = self.base_path / filename
        file.save(str(file_path))
        return str(file_path)
    
    def get_model_file(self, filename):
        """Get model file path"""
        file_path = self.base_path / filename
        if file_path.exists():
            return str(file_path)
        return None