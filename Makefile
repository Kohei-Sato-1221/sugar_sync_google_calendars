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

deploy_sugar: ## deploy google apps script project
	make clone id=1CpPJ6wDO8B5gwW9w5C0ugPKubmlgAWro4amjEDnBvlbsR3_i0u0Riqwj
	cp files/consts_sugar.js files/consts_temp.js
	cp files/consts_sugar.js files/consts.js
	make deploy

deploy_58: ## deploy google apps script project
	make clone id=1iU70ADsfzHiJTAJzr_Uo4ZjWqqc7j3aLoZ_xNPvH06stAiu4TNr20L7G
	cp files/consts_58.js files/consts_temp.js
	cp files/consts_58.js files/consts.js
	make deploy