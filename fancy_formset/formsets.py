import json

from django.forms import Media
from django.forms.formsets import BaseFormSet
from django.forms.models import BaseInlineFormSet, BaseModelFormSet
from django.utils.safestring import mark_safe


class FancyFormMixin:
    template_name = "fancy_formset/default.html"
    template_name_div = "fancy_formset/div.html"
    template_name_p = "fancy_formset/p.html"
    template_name_table = "fancy_formset/table.html"
    template_name_ul = "fancy_formset/ul.html"

    fancy_options = None

    @property
    def media(self):
        """
        Form media including django-fancy-formset styles and JavaScript
        """
        base_media = super().media
        extra_media = Media(
            css={"all": ["fancy_formset/formset.min.css"]},
            js=["fancy_formset/formset.js"],
        )
        return base_media + extra_media

    @property
    def fancy_init(self):
        """
        Return the JavaScript to initialise this formset, suitable for use in <script>
        """
        tpl = "document.addEventListener('DOMContentLoaded',()=>{formset.init(%s,%s)});"
        return mark_safe(
            tpl
            % (
                json.dumps(self.fancy_options or {}),
                f"'[data-formset=\"{self.prefix}\"]'",
            )
        )


class FancyFormSet(FancyFormMixin, BaseFormSet):
    pass


class FancyModelFormSet(FancyFormMixin, BaseModelFormSet):
    pass


class FancyInlineFormSet(FancyFormMixin, BaseInlineFormSet):
    pass
