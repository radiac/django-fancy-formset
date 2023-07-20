from django.shortcuts import get_object_or_404, redirect, render

from .forms import AuthorForm, BookInlineFormSet
from .models import Author


def authors_list(request):
    return render(
        request,
        "library/author_list.html",
        {"authors": Author.objects.all()},
    )


def author_form(request, author_id=None):
    author = None
    if author_id:
        author = get_object_or_404(Author, pk=author_id)

    form = AuthorForm(request.POST or None, instance=author)
    formset = BookInlineFormSet(request.POST or None, instance=author)

    if form.is_valid() and formset.is_valid():
        author = form.save()
        formset.instance = author
        formset.save()
        return redirect("library:author_list")

    return render(
        request,
        "library/author_form.html",
        {"form": form, "formset": formset, "author": author},
    )
