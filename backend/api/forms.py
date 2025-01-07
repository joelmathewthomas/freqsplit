from django import forms

class UploadFileForm(forms.Form):
    file = forms.FileField(label='Select a file')

    # You can add custom validation if needed
    def clean_file(self):
        file = self.cleaned_data.get('file')
        if not file:
            raise forms.ValidationError("No file uploaded!")
        # Additional custom validations can be added here
        return file
