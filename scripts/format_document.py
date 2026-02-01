#!/usr/bin/env python3
"""
Script to format Word document with Times New Roman font using XML manipulation.
"""
import sys
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import tempfile
import shutil

def format_docx(docx_path):
    """
    Format Word document with Times New Roman font using XML direct manipulation.
    """
    docx_path = Path(docx_path)
    
    if not docx_path.exists():
        print(f"Error: File not found: {docx_path}")
        return False
    
    print("Formatting document with Times New Roman...")
    
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
            }
            
            # Register namespaces
            for prefix, uri in namespaces.items():
                ET.register_namespace(prefix, uri)
            
            # Find all runs and set font to Times New Roman
            for rPr in root.findall('.//w:rPr', namespaces):
                # Remove existing rFonts
                for rfonts in rPr.findall('w:rFonts', namespaces):
                    rPr.remove(rfonts)
                
                # Add Times New Roman
                rfonts = ET.Element('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rFonts')
                rfonts.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii', 'Times New Roman')
                rfonts.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}hAnsi', 'Times New Roman')
                rPr.insert(0, rfonts)
            
            # Write back
            tree.write(doc_xml_path, encoding='utf-8', xml_declaration=True)
            print("✓ Updated document.xml")
        
        # Process styles.xml
        styles_xml_path = temp_path / 'word' / 'styles.xml'
        if styles_xml_path.exists():
            tree = ET.parse(styles_xml_path)
            root = tree.getroot()
            
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            }
            
            for prefix, uri in namespaces.items():
                ET.register_namespace(prefix, uri)
            
            # Update Normal style
            for style in root.findall('.//w:style', namespaces):
                if style.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}styleId') in ['Normal', 'Heading1', 'Heading2', 'Heading3']:
                    rPr = style.find('w:rPr', namespaces)
                    if rPr is not None:
                        for rfonts in rPr.findall('w:rFonts', namespaces):
                            rPr.remove(rfonts)
                        rfonts = ET.Element('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}rFonts')
                        rfonts.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}ascii', 'Times New Roman')
                        rfonts.set('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}hAnsi', 'Times New Roman')
                        rPr.insert(0, rfonts)
            
            tree.write(styles_xml_path, encoding='utf-8', xml_declaration=True)
            print("✓ Updated styles.xml")
        
        # Repackage docx
        with ZipFile(docx_path, 'w') as zip_ref:
            for file_path in temp_path.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(temp_path)
                    zip_ref.write(file_path, arcname)
    
    print(f"✅ Successfully formatted document: {docx_path}")
    print("   - Font: Times New Roman")
    return True

if __name__ == '__main__':
    docx_file = Path(__file__).parent.parent / 'docs' / 'laporan-proyek.docx'
    
    if len(sys.argv) > 1:
        docx_file = Path(sys.argv[1])
    
    format_docx(docx_file)
