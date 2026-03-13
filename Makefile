.PHONY: format preview view

format:
	prettier --write .

preview:
	live-server docs

view:
	xdg-open https://cosmo-grant.github.io/grid-worlds
