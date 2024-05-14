(() => {
	isFirefox = () => {
		return typeof browser !== 'undefined';
	}

	// Gets all images
	const images = document.getElementsByTagName('img');
	const number = images.length;
	const missingAltNumber = document.querySelectorAll('img[alt=" "], area[alt=" "], input[type="image"][alt=" "], img:not([alt]), area:not([alt]), input[type="image"]:not([alt])').length;
	// Declare Arrays to fill
	const errorLists = [];
	const errorNumbers = [];
	const errorInfo = [];
	const modalContent = [];
	// Gets all buttons with a missing type that are not form buttons
	// Adds relevant infos for button type missing and its modal
	errorLists[0] = document.querySelectorAll('button:not([type], [form], [formaction], [formtarget])');
	errorNumbers[0] = errorLists[0].length;
	errorInfo[0] ={
		errorTypeHeader: chrome.i18n.getMessage('buttonTypeHeader'),
		errorTypeNumber: errorNumbers[0],
		errorTypeNumberText: 'checkButtonTypesNumber',
		errorShowButton: 'buttonTypeMissing',
		errorExplanation: 'buttonTypeExplain',
		listId: 'buttonType-list',
		modalId: 'buttonTypeModal'
	};
	modalContent[0]  = {
		errorSource: 'buttonTypeErrorSource',
		context: 'buttonTypeContext',
		procedure: 'buttonTypeProcedure',
		guideline: 'buttonTypeGuideline',
		guidelineSource: 'buttonTypeSource',
		techniques: 'buttonTypeTechniques',
	};
	// Gets all elements with a positive tabindex
	// Adds relevant infos for positive tabindex and its modal
	errorLists[1] = document.querySelectorAll('[tabindex]:not([tabindex="0"],[tabindex^="-"])');
	errorNumbers[1] = errorLists[1].length;
	errorInfo[1] ={
		errorTypeHeader: chrome.i18n.getMessage('tabindexHeader'),
		errorTypeNumber: errorNumbers[1],
		errorTypeNumberText: 'checkTabindexNumber',
		errorShowButton: 'tabindexPositive',
		errorExplanation: 'tabindexPositiveExplain',
		listId: 'tabindex-list',
		modalId: 'tabindexModal'
	};
	modalContent[1] = {
		errorSource: 'tabindexErrorSource',
		context: 'tabindexContext',
		procedure: 'tabindexProcedure',
		guideline: 'tabindexGuideline',
		guidelineSource: 'tabindexSource',
		techniques: 'tabindexTechniques',
	};
	// Gets all input elements with a missing name attribute
	// Adds relevant infos for missing name attribute and its modal
	errorLists[2] = document.querySelectorAll('[type="radio"]:not([name]),[type="checkbox"]:not(:only-of-type, [name])');
	errorNumbers[2] = errorLists[2].length;
	errorInfo[2] ={
		errorTypeHeader: chrome.i18n.getMessage('inputNameHeader'),
		errorTypeNumber: errorNumbers[2],
		errorTypeNumberText: 'checkInputNamesNumber',
		errorShowButton: 'inputNameMissing',
		errorExplanation: 'inputNameExplain',
		listId: 'inputName-list',
		modalId: 'inputNameModal'
	};
	modalContent[2] = {
		errorSource: 'inputNameErrorSource',
		context: 'inputNameContext',
		procedure: 'inputNameProcedure',
		guideline: 'inputNameGuideline',
		guidelineSource: 'inputNameSource',
		techniques: 'inputNameTechniques',
	};
	// Get empty title tag
	// Adds relevant infos for empty title tag and its modal
	errorLists[3] = document.querySelectorAll('title:empty');
	errorNumbers[3] = errorLists[3].length;
	errorInfo[3] ={
		errorTypeHeader: chrome.i18n.getMessage('titleTagHeader'),
		errorTypeNumber: errorNumbers[3],
		errorTypeNumberText: 'checkTitleTagsNumber',
		errorShowButton: 'titleTagEmpty',
		errorExplanation: 'titleTagExplain',
		listId: 'titleTag-list',
		modalId: 'titleTagModal'
	};
	modalContent[3] = {
		errorSource: 'titleTagErrorSource',
		context: 'titleTagContext',
		procedure: 'titleTagProcedure',
		guideline: 'titleTagGuideline',
		guidelineSource: 'titleTagSource',
		techniques: 'titleTagTechniques',
	};
	// Gets all optgroup with no label
	// Adds relevant infos for optgroup no label and its modal
	errorLists[4] = document.querySelectorAll('optgroup:not([label])');
	errorNumbers[4] = errorLists[4].length;
	errorInfo[4] ={
		errorTypeHeader: chrome.i18n.getMessage('optGroupLabelHeader'),
		errorTypeNumber: errorNumbers[4],
		errorTypeNumberText: 'checkOptGroupLabelsNumber',
		errorShowButton: 'optGroupLabelMissing',
		errorExplanation: 'optGroupLabelExplain',
		listId: 'optGroupLabel-list',
		modalId: 'optGroupLabelModal'
	};
	modalContent[4] = {
		errorSource: 'optGroupLabelErrorSource',
		context: 'optGroupLabelContext',
		procedure: 'optGroupLabelProcedure',
		guideline: 'optGroupLabelGuideline',
		guidelineSource: 'optGroupLabelSource',
		techniques: 'optGroupLabelTechniques',
	};
	// Calculate total number of errors
	const accumulatedNumber = number + errorNumbers.reduce((total,current)=> total + current,0)

	//If there are no errors send message to disable the button
	if ( isFirefox() ) {
		// Firefox
		browser.runtime.sendMessage({ a11ycss_reporter: 'alt', a11ycss_reported: accumulatedNumber });
	} else {
		// Edge, Chrome
		if (accumulatedNumber  === 0) {
			chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
				if (message.a11ycss_should_report && message.a11ycss_should_report === 'alt') {
					sendResponse('nope');
				}
			});
		}
	}
	// Helper functions
	serveErrorCard = (errorTypeInfo) => {
		//Object destructuring to easier access properties
		const {
			errorTypeHeader,
			errorTypeNumber,
			errorTypeNumberText,
			errorShowButton,
			errorExplanation,
			listId,
			modalId
		} = errorTypeInfo;

		const errorBody = `<div class="error-body">
			<h2 class="errorType-header">${errorTypeHeader}</h2>
			<h2 class="errorType-number">${chrome.i18n.getMessage(errorTypeNumberText, [errorTypeNumber,missingAltNumber])}</h2>
			<div class="errorType-buttonGroup">
				<button class="errorType-button" type="button" id=${errorShowButton}>Show</button>
				<button class="errorType-button" type="button" id=${errorExplanation}>Details</button>
			</div>
		</div>
		`
		const addErrorBody = document.createRange().createContextualFragment(errorBody);

		addErrorBody.getElementById(errorShowButton).addEventListener('click',()=>{
			document.getElementById(listId).classList.toggle('hidden');
			const showButton = document.getElementById(errorShowButton)
			showButton.innerText = showButton.innerText === 'Show' ? 'Hide' : 'Show'
		})
		addErrorBody.getElementById(errorExplanation).addEventListener('click',()=>{
			document.getElementById(modalId).classList.add('open');
		})
		return addErrorBody
	}

	serveErrorModal = (modalId, modalHeader, modalBody) => {
		const {
			errorSource,
			context,
			procedure,
			guideline,
			guidelineSource,
			techniques} = modalBody

		const modal = `<div id=${modalId} class="modal">
			<div class="modal-background">
				<div class="modal-inner">
					<h1>${modalHeader}</h1>
					<div>
						<h3>Error Source<h3>
						<p>${chrome.i18n.getMessage(errorSource)}</p>
					</div>
					<div>
						<h3>Context / Importance<h3>
						<p>
						${chrome.i18n.getMessage(context)}
						</p>
					</div>
					<div>
						<h3>Procedure / Fix<h3>
						<p>
							${chrome.i18n.getMessage(procedure)}
						</p>
					</div>
					<div>
						<h3>More on the topic<h3>
						<p>${chrome.i18n.getMessage(guideline)} <a 
						href="${chrome.i18n.getMessage(guidelineSource)}"
						target="_blank"
						rel="noopener noreferrer"
						class="regular-link">
							${chrome.i18n.getMessage(guidelineSource)}
						</a>
						<p/>
						<p>More techniques can be found here:<br/>
						<a href="${chrome.i18n.getMessage(techniques)}"
						target="_blank"
						rel="noopener noreferrer"
						class="regular-link">
							${chrome.i18n.getMessage(techniques)}
						</a></p>
					</div>
				</div>
				<button class="errorType-button"
				type="button" id="modalButton">Close</button>
			</div>
		</div>
		`
		const addModal = document.createRange().createContextualFragment(modal);
		addModal.getElementById('modalButton').addEventListener('click',()=>{
			document.getElementById(modalId).classList.remove('open')
		})
		return addModal
	}
	// Functions creating interface components
	collectImages = (reporter, images) => {
		const fragment = document.createDocumentFragment();
		// Adds sidebar header, might need moving
		const heading = document.createElement('h1');
		heading.innerText = chrome.i18n.getMessage('errorListHeading');
		fragment.append(heading);
		// Show Total number of errors
		const totalErrors = document.createElement('h2');
		totalErrors.innerText= chrome.i18n.getMessage('errorListTotal', String(missingAltNumber + errorNumbers.reduce((total,current)=> total + current,0)));
		fragment.append(totalErrors);
		// Adds list that can be toggled
		const list = document.createElement('ol');
		list.id = 'alt-list';
		list.classList = 'hidden alt-list'
		
		// Adds relevant infos to an object
		const errorTypeInfo = {
			errorTypeHeader: chrome.i18n.getMessage('altHeader'),
			errorTypeNumber: number,
			errorTypeNumberText: 'checkAltsNumber',
			errorShowButton: 'buttonImagesAlt',
			errorExplanation: 'imagesAltExplain',
			listId: 'alt-list',
			modalId: 'imgModal'
		};
		// Adds card interface for the error type
		const addErrorBody = serveErrorCard(errorTypeInfo);
		fragment.appendChild(addErrorBody);

		// Adds modal text to an object
		const modalBody = {
			errorSource: 'altErrorSource',
			context: 'altContext',
			procedure: 'altProcedure',
			guideline: 'altGuideline',
			guidelineSource: 'altSource',
			techniques: 'altTechniques',
		}
		// Adds modal with error type explanations
		const addErrorModal = serveErrorModal(errorTypeInfo.modalId, 'Missing alt values', modalBody);
		fragment.appendChild(addErrorModal);

		// Compiles list of images to show
		for (const image of images) {
			const target = `a11ycssTarget-${Math.floor(Math.random() * Date.now()).toString(36)}`;
			const anchor = document.createRange().createContextualFragment(`<a id="${target}" style="--a11ycss-offset: ${image.height / 32}rem" title="${chrome.i18n.getMessage("scrollTarget")}"></a>`);
			image.parentNode.insertBefore(anchor, image);

			let alt = '';
			let icon = '';
			switch (image.getAttribute('alt')) {
				case null:
					alt = chrome.i18n.getMessage("altMissing");
					icon = chrome.runtime.getURL("/icons/ko.svg");
					break;
				case '':
					alt = chrome.i18n.getMessage("altEmpty");
					icon = chrome.runtime.getURL("/icons/info.svg");
					break;
				default:
					alt = image.alt;
					icon = chrome.runtime.getURL("/icons/ok.svg");
					break;
			}

			let title = '';
			switch (image.getAttribute('title')) {
				case null:
					title = chrome.i18n.getMessage("altEmpty");
					break;
				case '':
					title = chrome.i18n.getMessage("altMissing");
					break;
				default:
					title = image.title;
					break;
			}

			const figure = `<li>
				<figure role="group">
					<img src="${image.src}" alt="a11ycss temporary image">
					<figcaption style="--a11ycss-icon: url(${icon})">
						<dl>
							<dt><code>alt</code></dt>
							<dd>${alt}</dd>
							<dt><code>title</code></dt>
							<dd>${title}</dd>
						</dl>
						<a href="#${target}" title="${chrome.i18n.getMessage("scrollToImage")}">
							<span class="visually-hidden">${chrome.i18n.getMessage("scrollToImage")}</span>
						</a>
					</figcaption>
				</figure>
			</li>`;

			const item = document.createRange().createContextualFragment(figure);
			list.appendChild(item);
		}

		// Adds list to document
		fragment.append(list);

		reporter.appendChild(fragment);
	}

	collectErrorType = (reporter, errorTypeList, errorTypeInfo, modalBody)=>{
		const fragment = document.createDocumentFragment();

		// Adds list that can be toggled
		const list = document.createElement('ol');
		list.id = errorTypeInfo.listId;
		list.classList = 'hidden ' + errorTypeInfo.listId;

		
		// Adds card interface for the error type
		const addErrorBody = serveErrorCard(errorTypeInfo);
		fragment.appendChild(addErrorBody);
		
		// Adds modal with error type explanations
		const addErrorModal = serveErrorModal(errorTypeInfo.modalId, errorTypeInfo.errorTypeHeader, modalBody)
		fragment.appendChild(addErrorModal);
		
		// Compiles list of button type missing errors
		for(const errorType of errorTypeList){

			//const value = errorType.outerHTML;
			//const code = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			//const icon = chrome.runtime.getURL("/icons/ko.svg");
			const target = `a11ycssTarget-${Math.floor(Math.random() * Date.now()).toString(36)}`;
			const anchor = document.createRange().createContextualFragment(`<a id="${target}" style="--a11ycss-offset: 2rem" title="${chrome.i18n.getMessage("scrollTarget")}"></a>`);
			errorType.parentNode.insertBefore(anchor, errorType);

			const figure = `<li>
				<figure class="errorType-figure" role="group">
					<figcaption>
							<h3><code>Error:</code></h3>
							<h4 class="errorTypeList-header">${errorTypeInfo.errorTypeHeader}</h4>
						<p>Click to highlight</p>
						<a href="#${target}" title="${chrome.i18n.getMessage("scrollToImage")}">
							<span class="visually-hidden">${chrome.i18n.getMessage("scrollToImage")}</span>
						</a>
					</figcaption>
				</figure>
			</li>`;

			const item = document.createRange().createContextualFragment(figure);
			list.appendChild(item);
		}
		
		// Adds list to document
		fragment.append(list);

		reporter.appendChild(fragment);
	}

	toggleReporter = () => {
		const reporter = document.getElementById('a11ycss-reporter');
		if (reporter) {
			reporter.innerHTML = '';
			document.body.removeChild(reporter);
			document.body.classList.remove('a11css-active');
		} else {
			const reporter = document.createElement('section');
			reporter.id = 'a11ycss-reporter';
			document.body.appendChild(reporter);
			document.body.classList.add('a11css-active');
			collectImages(reporter, images);
			// Render error cards only if number > 0
			for(let i = 0; i < errorNumbers.length; i++){
				if(errorNumbers[i] > 0 ){
					collectErrorType(reporter, errorLists[i], errorInfo[i], modalContent[i])
				}
	  			continue
			}
		}
	}

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.getImagesCount && isFirefox()) {
			sendResponse(number);
		}
		if (message.a11ycss_action && message.a11ycss_action === "alt") {
			toggleReporter(images);
		}
	});
})();
