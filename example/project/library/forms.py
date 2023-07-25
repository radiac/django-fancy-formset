from django import forms

from fancy_formset import FancyModelFormSet

from .models import Author, Book, Review


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

ReviewModelFormSet = forms.modelformset_factory(
    Review,
    formset=FancyModelFormSet,
    fields=("reviewer", "review"),
    can_delete=True,
)
