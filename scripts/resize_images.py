#!/usr/bin/env python3
"""
Script to resize all images in a Word document to smaller, consistent widths.
Uses python-docx to manipulate the .docx file.
"""
import sys
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

# Image size configurations (in inches)
SMALL = 2.0    # 2 inches ~ 1.9 cm
MEDIUM = 2.3   # 2.3 inches ~ 2.2 cm
LARGE = 2.5    # 2.5 inches ~ 2.4 cm

def resize_docx_images(docx_path, output_path=None):
    """
    Resize all images in a Word document to smaller, consistent sizes.
    """
    if output_path is None:
        output_path = docx_path
    
    # Convert to Path object
    docx_path = Path(docx_path)
    
    if not docx_path.exists():
        print(f"Error: File not found: {docx_path}")
        return False
    
    # Create temporary directory for extraction
    import tempfile
    import shutil
    
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Extract docx
        with ZipFile(docx_path, 'r') as zip_ref:
            zip_ref.extractall(temp_path)
        
        # Process document.xml
        doc_xml_path = temp_path / 'word' / 'document.xml'
        if doc_xml_path.exists():
            tree = ET.parse(doc_xml_path)
            root = tree.getroot()
            
            # Define namespaces
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
                'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
                'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
                'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            }
            
            # Register namespaces to preserve prefixes
            for prefix, uri in namespaces.items():
                ET.register_namespace(prefix, uri)
            
            # Find all drawing elements
            for draw in root.findall('.//w:drawing', namespaces):
                for inline in draw.findall('.//wp:inline', namespaces):
                    # Get extent (size) element
                    extent = inline.find('wp:extent', namespaces)
                    if extent is not None:
                        # EMU (English Metric Units): 914400 EMU = 1 inch
                        # Set to 5 inches
                        new_width = int(5.0 * 914400)  # 5 inches in EMU
                        new_height = int(5.0 * 914400)  # Keep square aspect for now
                        
                        extent.set('cx', str(new_width))
                        extent.set('cy', str(new_height))
                        print(f"✓ Resized inline image to 5.0 x 5.0 inches")
                
                for anchor in draw.findall('.//wp:anchor', namespaces):
                    # Get extent (size) element for anchored images
                    extent = anchor.find('wp:extent', namespaces)
                    if extent is not None:
                        new_width = int(5.0 * 914400)
                        new_height = int(5.0 * 914400)
                        
                        extent.set('cx', str(new_width))
                        extent.set('cy', str(new_height))
                        print(f"✓ Resized anchored image to 5.0 x 5.0 inches")
            
            # Write back
            tree.write(doc_xml_path, encoding='utf-8', xml_declaration=True)
        
        # Repackage docx
        with ZipFile(output_path, 'w') as zip_ref:
            for file_path in temp_path.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(temp_path)
                    zip_ref.write(file_path, arcname)
    
    print(f"\n✅ Successfully resized images in: {output_path}")
    return True

if __name__ == '__main__':
    docx_file = Path(__file__).parent.parent / 'docs' / 'laporan-proyek.docx'
    
    if len(sys.argv) > 1:
        docx_file = Path(sys.argv[1])
    
    resize_docx_images(docx_file)
