var showingSourceCode = false;
var isInEditMode = true;

const functionsTypesEditor = ['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyCenter'];
const extensionsAcceptsImage = ['.png', '.jpg', '.jpeg', '.gif'];

/**
 * Constants responsible for the formation of the rich editor and modals
 **/
const contentRichEditor = '';
const contentInsertLink = '<div id="richTextModalMain"><div id="richTextModalHeader"><div id="richTextModalHeader-Title">Inserir Link</div><div id="richTextModalHeader-Close"></div></div><div id="richTextModalBody"><div id="richTextModalError"></div><input type="text" id="richTextModalInputLink" placeholder="Insira a URL aqui..."></div><div id="richTextModalFooter" class="richTextModalAlignRight"><button class="richTextModalButton richTextModalButtonBlue" onclick="execInsertLink();">OK</button><button class="richTextModalButton" onclick="closeModal();">Cancelar</button></div></div>';
const contentInsertImage = '<div id="richTextModalMain" class="richTextModalExpand"><div id="richTextModalHeader"><div id="richTextModalHeader-Title">Inserir Imagem</div><div id="richTextModalHeader-Close"></div></div><div id="richTextModalBody"><div id="richTextModalError"></div><div id="richTextModalPreviewImage"><img></div><div id="richTextModalImageBody"><div id="richTextModalUploadImage"><h3>Selecione uma imagem:</h3><input type="file" id="richTextModalInputUploadImage" onchange="ProcessImagePreview(this);"></div><div id="richTextModalImportImage"><h3>Se preferir, informe uma URL:</h3><input type="text" id="richTextModalInputLink" placeholder="Insira a URL aqui..." onkeyup="ProcessImagePreview(this);"></div><div id="richTextModalImporteImageManager"><label class="toggle"><input id="field-saveImageSnowDev" class="toggle__input" type="checkbox" value="1" checked><span class="toggle__label"><span class="toggle__text">Deseja salvar a imagem da URL na SnowDev?</span></span></label></div></div></div><div id="richTextModalFooter" class="richTextModalAlignRight"><button class="richTextModalButton richTextModalButtonBlue" onclick="execInsertImage();">OK</button><button class="richTextModalButton" onclick="closeModal();">Cancelar</button></div></div>';

/**
 * Enable richText
 **/
function enableEditMode(){
	richTextField.document.designMode = 'on';
	richTextField.document.body.style.wordWrap = 'break-word';
	richTextField.document.body.style.color = '#000000';
	richTextField.document.body.style.fontFamily = 'Arial';
	
	//richTextField.document.body.innerHTML = 'INSERIR UM TEXTO PADRAO NO EDITOR DE TEXTO';
	
	document.getElementById('richTextField').contentWindow.document.onkeyup = function(){ onKeyUP(); }
	document.getElementById("richTextField").contentWindow.document.body.onclick = function(){ onClick(); }
}

/**
 * Function responsible for any changes or clicks within the richText
 **/
function processEventEditor(){
	for(let i in functionsTypesEditor){
		if(checkTextSelectionState(functionsTypesEditor[i])){
			setItemMenuSelected(functionsTypesEditor[i]);
		} else {
			unsetItemMenuSelected(functionsTypesEditor[i]);
		}
	}
	
	var richTextFieldFontName = richTextField.document.queryCommandValue('fontName').replaceAll('"', '');
	var richTextFieldFontSize = richTextField.document.queryCommandValue('fontSize');
	
	document.getElementById('fontName').value = richTextFieldFontName;
	document.getElementById('fontSize').value = richTextFieldFontSize;
}

/**
 * Function responsible for showing the preview of the image being inserted
 **/
function ProcessImagePreview(image){
	if(image.files && image.files[0]){
		var reader = new FileReader();
		
		reader.onload = function(e){
			$('#richTextModalPreviewImage img').attr('src', e.target.result);
		}
		
		reader.readAsDataURL(image.files[0]);
	} else if(endsWithAny(extensionsAcceptsImage, image.value)){
		$('#richTextModalPreviewImage img').attr('src', image.value);
	}
}

function getContent(){
	return richTextField.document.getElementsByTagName('body')[0].innerHTML;
}

/**
 * Function responsible for manipulating actions on key up in richText
 **/
function onKeyUP(){
	var richTextFieldText = richTextField.document.getElementsByTagName('body')[0].innerHTML;
	var richTextCurruntLength = richTextFieldText.length;
	
	$('#richTextCurruntLength').text(richTextCurruntLength);
	
	processEventEditor();
}

/**
 * Function responsible for manipulating actions on click in richText
 **/
function onClick(){
	processEventEditor();
}

/**
 * Brand an item in the editor menu how selected
 **/
function setItemMenuSelected(elementID){
	document.getElementById(elementID).style.background = 'rgba(0, 0, 0, 0.3)';
}

/**
 * Brand an item in the editor menu how unselected
 **/
function unsetItemMenuSelected(elementID){
	document.getElementById(elementID).style.background = 'rgba(0, 0, 0, 0.0)';
}

/**
 * Check State richTextField
 **/
function checkTextSelectionState(commandState){
	if(document.queryCommandState) return richTextField.document.queryCommandState(commandState);
	
	return false;
}

/**
 * Function responsible mark a menu item as selected / unselected and process the command
 **/
function execCmd(command){
	if(command == 'justifyLeft'){
		unsetItemMenuSelected('justifyCenter');
		unsetItemMenuSelected('justifyRight');
	} else if(command == 'justifyCenter'){
		unsetItemMenuSelected('justifyLeft');
		unsetItemMenuSelected('justifyRight');
	} else if(command == 'justifyRight'){
		unsetItemMenuSelected('justifyLeft');
		unsetItemMenuSelected('justifyCenter');
	}
	
	$(function(){
		if(checkTextSelectionState(command)){
			setItemMenuSelected(command); 
		} else {
			unsetItemMenuSelected(command); 
		}
	});
	
	execCommandWithArg(command, null);
}

/**
 * 
 **/
function execCommandWithArg(command, arg){
	document.getElementsByName("richTextField")[0].contentWindow.document.body.focus();
	richTextField.document.execCommand(command, false, arg);
}

/**
 * Function responsible for processing link insertion
 **/
function execInsertLink(){
	var inputURL = document.getElementById('richTextModalInputLink').value;
	
	$('#richTextModalError').hide();
	
	if(inputURL == ''){
		$('#richTextModalError').text('Informe uma URL para continuar.');
		$('#richTextModalError').show();
	} else if(inputURL.length < 5){
		$('#richTextModalError').text('Informe uma URL valida!');
		$('#richTextModalError').show();
	} else {
		execCommandWithArg('createLink', inputURL);
		
		closeModal();
		
		enableEditMode();
	}
}

/**
 * Function responsible for processing image insertion
 **/
function execInsertImage(){
	var inputImageURL = document.getElementById('richTextModalInputLink').value;
	var image = $('#richTextModalInputUploadImage')[0];
	
	$('#richTextModalError').hide();
	
	if(image.files && image.files[0]){
		
	} else if(inputImageURL != ''){
		if(inputImageURL.length < 5){
			$('#richTextModalError').text('Informe uma URL valida!');
			$('#richTextModalError').show();
		} else {
			execCommandWithArg('insertImage', inputImageURL);
			
			richTextField.document.getElementsByTagName("img")[(richTextField.document.getElementsByTagName('img').length - 1)].style.maxWidth = '100%';
			
			closeModal();

			enableEditMode();

		}
	} else {
		$('#richTextModalError').text('Selecione uma imagem para continuar.');
		$('#richTextModalError').show();
	}
}

/**
 * Function responsible for opening the modal of a particular item
 **/
function openModal(modal){
	switch(modal){
		case 'InsertLink':
			$('#richTextModal').html(contentInsertLink);
			$('#richTextModal').fadeIn();
			break;
		case 'InsertImage':
			$('#richTextModal').html(contentInsertImage);
			$('#richTextModal').fadeIn();
			break;
	}
}

/**
 * Function responsible for closing anyone modal
 **/
function closeModal(){
	$('#richTextModal').empty();
	
	if($('#richTextModal').is(":visible")) $('#richTextModal').fadeOut();
}

/**
 * Check if string ends with any of array suffixes
 **/
function endsWithAny(suffixes, string){
    for(let suffix of suffixes){
        if(string.endsWith(suffix)) return true;
    }
	
    return false;
}

/**
 * System ReplaceAll
 **/
String.prototype.replaceAll = function(de, para){
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1){
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
    return (str);
}