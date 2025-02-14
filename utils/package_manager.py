import os
import zipfile
import tempfile
import shutil
from werkzeug.utils import secure_filename

class PackageManager:
    def __init__(self, base_path):
        self.base_path = base_path
        
    def create_model_package(self, model, user_id):
        """Create a secure package of the model files"""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create a unique package ID
            package_id = f"{model['name']}_{user_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            package_path = os.path.join(temp_dir, secure_filename(package_id))
            os.makedirs(package_path)
            
            # Copy model files
            self._copy_model_files(model, package_path)
            
            # Create zip file
            zip_path = os.path.join(temp_dir, f"{package_id}.zip")
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                for root, _, files in os.walk(package_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arc_name = os.path.relpath(file_path, package_path)
                        zf.write(file_path, arc_name)
                        
            return zip_path
            
    def _copy_model_files(self, model, package_path):
        """Copy model files to package directory"""
        # Copy main model file
        shutil.copy2(
            os.path.join(self.base_path, model['model_file']),
            os.path.join(package_path, os.path.basename(model['model_file']))
        )
        
        # Copy example code
        with open(os.path.join(package_path, 'example.py'), 'w') as f:
            f.write(model['example_code'])
            
        # Create requirements.txt
        with open(os.path.join(package_path, 'requirements.txt'), 'w') as f:
            f.write('\n'.join(model['requirements']))