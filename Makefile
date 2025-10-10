help: ## print this message
	@echo ""
	@echo "Command list:"
	@printf "\033[36m%-35s\033[0m %s\n" "[Sub command]" "[Description]"
	@grep -E '^[/a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | perl -pe 's%^([/a-zA-Z_-]+):.*?(##)%$$1 $$2%' | awk -F " *?## *?" '{printf "\033[36m%-35s\033[0m %s\n", $$3 ? $$3 : $$1, $$2}'
	@echo ""


prepare: ## prepare for local development environment
	npm i @google/clasp -g  

login: ## login to google for clasp
	clasp login

clone: ## clone google apps script project  ## clone id={script_id}
	cd workspace && clasp clone ${id}

deploy: ## deploy google apps script project
	cp files/libs.js workspace/libs.js
	cp files/consts.js workspace/consts.js
	cp files/main.js workspace/main.js
	cp files/processSourceEvents.js workspace/processSourceEvents.js
	cp files/deleteOrphanedEvents.js workspace/deleteOrphanedEvents.js
	cd workspace && clasp push
