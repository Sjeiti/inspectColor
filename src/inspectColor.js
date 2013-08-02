if (window.inspectColor===undefined) window.inspectColor = (function(undefined){
	var mBody
		,aCssToCheck = [
			'color'
			,'background-color'
			,'background-image'
			,'border-color'
			,'box-shadow'
		]
		,mResult = createElement('.showColor')
		,mPath = createElement('ul.path',mResult)
		,mColor = createElement('.color')
		,iZIndex = (Math.pow(2,31)-1)/2<<0
		,sClassnameSelected = 'selected'
		,iClose = 14
		,iCloseHalf = iClose/2
		,iCloseOff = 1
		,iClosePos = iCloseHalf - iCloseOff
		,mStyle = createElement('style',mResult)
	;
	/////////////////////
	// style
	mStyle.innerText = '.showColor {'
			+'position:absolute;'
			+'padding: 6px;'
			+'background-color: #EEE;'
			+'border:1px solid #AAA;'
			+'z-index:'+iZIndex+';'
			+'box-shadow: 2px 4px 8px rgba(0,0,0,.3);'
			+'border-radius: 2px;'
		+'}'
		+'.showColor * {'
			+'font: 10px/10px Arial, sans-serif;'
			+'color: #333;'
		+'}'
		+'.showColor .close {'
			+'position: absolute;'
			+'right: -'+iClosePos+'px;'
			+'top: -'+iClosePos+'px;'
			+'width: '+iClose+'px;'
			+'height: '+iClose+'px;'
			+'border-radius: '+iCloseHalf+'px;'
			+'border-radius: '+iCloseHalf+'px;'
			+'background-color:#EEE;'
			+'box-shadow: 0 0 0 1px #AAA;'
			+'z-index:-2;'
			+'cursor: pointer;'
		+'}'
		+'.showColor .close:before {'
			+'content: \' \';'
			+'position: absolute;'
			+'right: '+iClosePos+'px;'
			+'top: '+iClosePos+'px;'
			+'width: '+iClose+'px;'
			+'height: '+iClose+'px;'
			+'background-color: #EEE;'
			+'z-index:-1;'
		+'}'
		+'.showColor .close:after {'
			+'content: \'x\';'
			+'position: absolute;'
			+'right: 0;'
			+'top: 0;'
			+'width: '+iClose+'px;'
			+'height: '+iClose+'px;'
			+'font: bold 11px/'+ (.9*iClose<<0)+'px Arial, sans-serif;'
			+'color: #666;'
			+'text-align: center;'
			+'z-index:0;'
		+'}'
		+'.showColor .about {'
			+'position: absolute;'
			+'right: 0;'
			+'bottom: 0;'
//			+'border: 6px dashed #333;'
//			+'border-color: transparent #AAA #AAA transparent;'
			+'cursor: pointer;'
		+'}'
		+'.showColor .about:after {'
			+'content: \'?\';'
		+'}'
		+'.showColor .path {'
			+'margin: 0 0 6px;'
			+'padding: 0;'
			+'list-style: none;'
		+'}'
			+'.showColor .path li {'
				+'display: inline;'
				+'padding: 0;'
				+'font: bold 12px/14px Arial, sans-serif;'
				+'cursor: pointer;'
			+'}'
			+'.showColor .path li.selected {'
				+'background-color: yellow;'
			+'}'
			+'.showColor .path li:after {'
				+'content: \'>\';'
				+'color: #999;'
				+'background-color: #EEE;'
			+'}'
			+'.showColor .path li:last-child:after {'
				+'content: \'\';'
			+'}'
		+'.showColor .color {'
			+'margin-bottom: 4px;'
			+'white-space: nowrap;'
			+'text-align: left;'
		+'}'
		+'.showColor .color:last-child {'
			+'margin-bottom: 0;'
		+'}'
			+'.showColor .color div {'
				+'display: inline-block;'
				+'margin-right: 6px;'
				+'vertical-align: top;'
			+'}'
			+'.showColor .color .box {'
				+'width: 20px;'
				+'height: 20px;'
				+'border:1px solid #888;'
			+'}'
			+'.showColor .color input {'
				+'width: 50px;'
				+'margin: 0;'
			+'}'
			+'.showColor .color .name {'
				+'padding-left: 6px;'
				+'vertical-align: middle;'
			+'}'
	;
	// color template
	createElement('.box',mColor);
	createElement('input.value',mColor).setAttribute('type','text');
	createElement('.name',mColor);
	// close
	createElement('.close',mResult).addEventListener('click',closeInspectColor);
	// about
	createElement('.about',mResult);//.addEventListener('click',closeInspectColor);
	/////////////////////
	function inspectColor(){
		mBody = document.body;
		document.addEventListener('click',handleClick,true);
	}
	function createElement(typeDotClassname,parent,prepend){
		var bHasClassname = !!typeDotClassname.match(/\./)
			,aTypeDotClassname = typeDotClassname.split(/\./)
			,sType = bHasClassname?(aTypeDotClassname[0]==''?'div':aTypeDotClassname[0]):typeDotClassname
			,sClass = bHasClassname?aTypeDotClassname.pop():undefined
			,mElement = document.createElement(sType)
		;
		if (sClass!==undefined) mElement.setAttribute('class',sClass);
		if (parent!==undefined) {
			if (!prepend||parent.childNodes.length===0) {
				parent.appendChild(mElement);
			} else {
				parent.insertBefore(mElement,parent.firstChild);
			}
		}
		return mElement;
	}
	function getStyle(element,styleProp) {
		return element.currentStyle?element.currentStyle[styleProp]:document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp);
	}
	function closeInspectColor(){
		if (mResult.parentNode) mResult.parentNode.removeChild(mResult);
		document.removeEventListener('click',handleClick,true);
	}
	function handleClick(e){
		var mTraverse = e.target
			,bInside = false;
		while (mTraverse!==mBody) {
			mTraverse = mTraverse.parentNode;
			bInside = mTraverse===mResult;
			if (bInside) break;
		}
		if (!bInside) {
			showInspector(e.target,e.clientX,e.clientY);
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	}
	function showInspector(element,x,y){
		addColors(element);
		// set path
		while (mPath.hasChildNodes()) {
			mPath.removeChild(mPath.lastChild);
		}
		getPath(element);
		// add to DOM and set position
		mResult.style.left = (Math.min(x,mBody.clientWidth-mResult.offsetWidth-30) + mBody.scrollLeft)+'px';
		mResult.style.top = (Math.min(y,mBody.clientHeight-mResult.offsetHeight-30) + mBody.scrollTop)+'px';
		mBody.appendChild(mResult);
	}
	function addColors(element){
		var aColors = mResult.getElementsByClassName('color');
		while (aColors.length) {
			var mColor = aColors[0];
			mColor.parentNode.removeChild(mColor);
		}
		for (var i=0,l=aCssToCheck.length;i<l;i++) {
			var sCssProperty = aCssToCheck[i];
			addColor(element,sCssProperty);
		}
	}
	function addColor(element,property){
		var aColors = getStyle(element,property).match(/rgba?\([^)]*\)/g)
			,iNumColors = aColors?aColors.length:0
			,bProceed = true;
		if (property=='border-color'&&getStyle(element,'border-width')=='0px') bProceed = false;
		if (iNumColors===1&&aColors[0]=='rgba(0, 0, 0, 0)') bProceed = false;
		if (bProceed) {
			for (var i=0;i<iNumColors;i++) {
				addColorLine(element,property+(iNumColors>1?' '+(i+1):''),aColors[i]);
			}
		}
	}
	function addColorLine(element,name,value){
		var mClone = mColor.cloneNode(true)
			,mBox = mClone.getElementsByClassName('box')[0]
			,mInput = mClone.getElementsByTagName('input')[0]
			,mName = mClone.getElementsByClassName('name')[0]
			,aRGB = value.match(/\d+/g)
			,sHex = '#'
			,bSetToHex = aRGB.length!==3
			,boxClick = function(){
				bSetToHex = !bSetToHex;
				mInput.value = bSetToHex?sHex:value;
			}
			,inputChange = function(){
				value = mInput.value;
				element.style[name] = value;
				mBox.style.backgroundColor = value;
			}
		;
		for (var i=0,l=aRGB.length;i<l;i++) {
			var iColor = parseInt(aRGB[i],10)
				,sSingle = iColor.toString(16).toUpperCase();
			sHex = sHex + (sSingle.length===1?'0':'') + sSingle;
		}
		mName.innerText = name;
		mBox.style.backgroundColor = value;
		mBox.addEventListener('click',boxClick);
		boxClick();
		mInput.addEventListener('change',inputChange);
		mResult.appendChild(mClone);
	}
	function getPath(element){
		while (element!==mBody.parentNode) {
			var sElement = element.nodeName.toLowerCase()
				,sClass = element.getAttribute('class')||''
				,sId = element.getAttribute('id')||''
				,mLi = createElement('li',mPath,true)
			;
			mLi.innerText = sElement;
			mLi.addEventListener('click',(function(element){return function(e){
				clickPathElement(element,e.currentTarget);
			}})(element));
			if (sClass!=''||sId!='') mLi.setAttribute('title',sElement + (sId!=''?('#'+sId):'') + (sClass!=''?('.'+sClass.replace(/\s+/g,'.')):''));
			element = element.parentNode;
		}
		mPath.lastChild.setAttribute('class',sClassnameSelected);
	}
	function clickPathElement(element,listElement){
		mPath.getElementsByClassName(sClassnameSelected)[0].removeAttribute('class');
		listElement.setAttribute('class',sClassnameSelected);
		addColors(element);
	}
	return inspectColor;
})();
inspectColor();