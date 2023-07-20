from django import forms

from .models import Author, Book


class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = ("name",)


BookInlineFormSet = forms.inlineformset_factory(
    Author,
    Book,
    fields=("title", "year_published"),
    min_num=0,
    max_num=5,
    extra=3,
)
