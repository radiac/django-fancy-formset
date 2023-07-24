from django.shortcuts import get_object_or_404, redirect, render

from .forms import AuthorForm, BookInlineFormSet, ReviewModelFormSet
from .models import Author, Book, Review


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


def review_form(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    formset = ReviewModelFormSet(
        request.POST or None, queryset=Review.objects.filter(book=book)
    )

    if formset.is_valid():
        reviews = formset.save(commit=False)
        for review in reviews:
            review.book = book
            review.save()
        return redirect("library:author_list")

    return render(
        request,
        "library/review_form.html",
        {"book": book, "formset": formset},
    )
