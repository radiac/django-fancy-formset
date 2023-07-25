from django.urls import path

from .views import author_form, authors_list, review_form


app_name = "library"
urlpatterns = [
    path("form/", author_form, name="author_form"),
    path("form/<int:author_id>/", author_form, name="author_form"),
    path("reviews/<int:book_id>/", review_form, name="review_form"),
    path("", authors_list, name="author_list"),
]
