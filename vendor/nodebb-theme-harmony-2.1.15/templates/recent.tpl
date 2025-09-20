{{{ if widgets.header.length }}}
<div data-widget-area="header">
	{{{each widgets.header}}}
	{{widgets.header.html}}
	{{{end}}}
</div>
{{{ end }}}

<div class="row flex-fill">
	<div class="recent {{{if widgets.sidebar.length }}}col-lg-9 col-sm-12{{{ else }}}col-lg-12{{{ end }}}">
		<!-- IMPORT partials/topic-list-bar.tpl -->

		<div class="category">
			<!-- Unanswered filter pills -->
			<div class="d-flex align-items-center gap-2 mb-3">
				<span class="text-muted">Filter:</span>
				<a class="btn btn-sm btn-outline-secondary"
					href="{relative_path}/recent">All</a>
				<a class="btn btn-sm btn-outline-secondary"
					href="{relative_path}/recent?filter=unreplied">Unanswered</a>
			</div>
			{{{ if !topics.length }}}
			<div class="alert alert-info" id="category-no-topics">[[recent:no-recent-topics]]</div>
			{{{ end }}}

			{{{ if (selectedCategory.cid == "-1") }}}
			<div class="py-3">
				<h4>[[recent:uncategorized.title]]</h4>
				<p>[[recent:uncategorized.intro]]</p>
			</div>
			{{{ end }}}

			<!-- IMPORT partials/topics_list.tpl -->

			{{{ if config.usePagination }}}
			<!-- IMPORT partials/paginator.tpl -->
			{{{ end }}}
		</div>
	</div>
	<div data-widget-area="sidebar" class="col-lg-3 col-sm-12 {{{ if !widgets.sidebar.length }}}hidden{{{ end }}}">
		{{{ each widgets.sidebar }}}
		{{widgets.sidebar.html}}
		{{{ end }}}
	</div>
</div>

<div data-widget-area="footer">
	{{{each widgets.footer}}}
	{{widgets.footer.html}}
	{{{end}}}
</div>