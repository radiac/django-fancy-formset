=====
Tests
=====

To run the tests::

    npm run test


To rebuild the example files:

#. Run the example site
#. Ensure ``library.forms.BookInlineFormSet`` has ``min_num=0, extra=3``
#. Ensure author id=1 exists, and they have 2 books: http://localhost:8000/
#. In this dir::

        curl http://localhost:8000/form/ > 01-add.html
        curl http://localhost:8000/form/1/ > 02-edit.html
