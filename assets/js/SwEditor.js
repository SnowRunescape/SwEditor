let showingSourceCode = false;
let isInEditMode = true;

const functionsTypesEditor = ["bold", "italic", "underline", "strikeThrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyCenter"];
const extensionsAcceptsImage = [".png", ".jpg", ".jpeg", ".gif"];

/**
 * Constants responsible for the formation of the rich editor and modals
 **/
const contentRichEditor = `<div class="richEditorMain"><div id="richTextModal"></div><div class="richEditorMenu"><div class="richEditorMenu-1"><select id="fontName" onchange='execCommandWithArg("fontName",this.value)' title="Fontes"><option value="Arial" selected="selected">Arial</option><option value="Comic Sans MS">Comic Sans MS</option><option value="Georgia">Georgia</option><option value="Tahoma">Tahoma</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option></select><select id="fontSize" onchange='execCommandWithArg("fontSize",this.value)' title="Tamanho da Fonte"><option value="1">1</option><option value="2">2</option><option value="3" selected="selected">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></div><div class="richEditorMenu-2"><a id="foreColor" onclick="openSelectColor()" title="Cor do Texto"><input id="fontColor" type="color" onchange='execCommandWithArg("foreColor",this.value)'></a></div><div class="richEditorMenu-3"><a id="bold" onclick='execCmd("bold")' title="Negrito"><i class="mdi mdi-format-bold"></i></a><a id="italic" onclick='execCmd("italic")' title="ItÃ¡lico"><i class="mdi mdi-format-italic"></i></a><a id="underline" onclick='execCmd("underline")' title="Sublinhado"><i class="mdi mdi-format-underline"></i></a><a id="strikeThrough" onclick='execCmd("strikeThrough")' title="Riscado"><i class="mdi mdi-format-strikethrough"></i></a></div><div class="richEditorMenu-4"><a id="justifyLeft" onclick='execCmd("justifyLeft")' title="Alinhar Ã  Esquerda"><i class="mdi mdi-format-align-left"></i></a><a id="justifyCenter" onclick='execCmd("justifyCenter")' title="Centralizar"><i class="mdi mdi-format-align-center"></i></a><a id="justifyRight" onclick='execCmd("justifyRight")' title="Alinhar Ã  Direita"><i class="mdi mdi-format-align-right"></i></a></div><div class="richEditorMenu-5"><a id="InsertLink" onclick='richTextOpenModal("InsertLink")' title="Inserir Link"><i class="mdi mdi-link-variant"></i></a><a id="unlink" onclick='execCmd("unlink")' title="Remover Link"><i class="mdi mdi-link-variant-remove"></i></a><a id="InsertCode" onclick='richTextOpenModal("InsertCode")' title="Inserir Codigo"><i class="mdi mdi-code-tags"></i></a><a id="InsertImage" onclick='richTextOpenModal("InsertImage")' title="Inserir Imagem"><i class="mdi mdi-image-filter"></i></a></div></div><iframe id="richTextField" name="richTextField"></iframe></div>`;
const contentInsertLink = '<div id="richTextModalMain"><div id="richTextModalHeader"><div id="richTextModalHeader-Title">Inserir Link</div><div id="richTextModalHeader-Close"></div></div><div id="richTextModalBody"><div id="richTextModalError"></div><input type="text" id="richTextModalInputLink" placeholder="Insira a URL aqui..."></div><div id="richTextModalFooter" class="richTextModalAlignRight"><button class="richTextModalButton richTextModalButtonBlue" onclick="execInsertLink();">OK</button><button class="richTextModalButton" onclick="richTextCloseModal();">Cancelar</button></div></div>';
const contentInsertImage = '<div id="richTextModalMain" class="richTextModalExpand"><div id="richTextModalHeader"><div id="richTextModalHeader-Title">Inserir Imagem</div><div id="richTextModalHeader-Close"></div></div><div id="richTextModalBody"><div id="richTextModalError"></div><div id="richTextModalPreviewImage"><img></div><div id="richTextModalImageBody"><div id="richTextModalUploadImage"><h3>Selecione uma imagem:</h3><input type="file" id="richTextModalInputUploadImage" onchange="ProcessImagePreview(this);"></div><div id="richTextModalImportImage"><h3>Se preferir, informe uma URL:</h3><input type="text" id="richTextModalInputLink" placeholder="Insira a URL aqui..." onkeyup="ProcessImagePreview(this);"></div><div id="richTextModalImporteImageManager"><label class="toggle"><input id="field-saveImageSnowDev" class="toggle__input" type="checkbox" value="1" checked><span class="toggle__label"><span class="toggle__text">Deseja salvar a imagem da URL na SnowDev?</span></span></label></div></div></div><div id="richTextModalFooter" class="richTextModalAlignRight"><button class="richTextModalButton richTextModalButtonBlue" onclick="execInsertImage();">OK</button><button class="richTextModalButton" onclick="richTextCloseModal();">Cancelar</button></div></div>';

/**
 * Enable richText
 **/
function enableEditMode()
{
    let defaultContent = $(".SwEditor").html();

    $(".SwEditor").html(contentRichEditor);

    richTextField.document.designMode = "on";
    richTextField.document.body.style.wordWrap = "break-word";
    richTextField.document.body.style.color = "#000000";
    richTextField.document.body.style.fontFamily = "Arial";

    const x = document.createElement("STYLE");
    const t = document.createTextNode(".richTextPre { background:#ecf0f3;padding:10px;border:solid 1px #bfc0c1;color:#676869;box-sizing:border-box;width:96%;margin:12px auto;white-space:pre-wrap; }");

    x.appendChild(t);
    richTextField.document.head.appendChild(x);

    richTextField.document.body.innerHTML = defaultContent;

    document.getElementById("richTextField").contentWindow.document.onkeyup = onKeyUP;
    document.getElementById("richTextField").contentWindow.document.body.onclick = onClick;
}

/**
 * Function responsible for any changes or clicks within the richText
 **/
function processEventEditor()
{
    for (let i in functionsTypesEditor) {
        if (checkTextSelectionState(functionsTypesEditor[i])) {
            setItemMenuSelected(functionsTypesEditor[i]);
        } else {
            unsetItemMenuSelected(functionsTypesEditor[i]);
        }
    }

    const richTextFieldFontName = richTextField.document.queryCommandValue("fontName").replaceAll('"', "");
    const richTextFieldFontSize = richTextField.document.queryCommandValue("fontSize");
    const richTextFieldFontColor = richTextField.document.queryCommandValue("ForeColor");

    document.getElementById("fontName").value = richTextFieldFontName;
    document.getElementById("fontSize").value = richTextFieldFontSize;
    document.getElementById("fontColor").value = rgbToHex(richTextFieldFontColor);
}

/**
 * Function responsible for showing the preview of the image being inserted
 **/
function ProcessImagePreview(image)
{
    if (image.files && image.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            $("#richTextModalPreviewImage img").attr("src", e.target.result);
        }

        reader.readAsDataURL(image.files[0]);
    } else if (endsWithAny(extensionsAcceptsImage, image.value)) {
        $("#richTextModalPreviewImage img").attr("src", image.value);
    }
}

/**
 * Function responsible for taking the content from the text editor
 **/
function richTextGetContent()
{
    return richTextField.document.getElementsByTagName("body")[0].innerHTML;
}

/**
 * Function responsible for setting the content from the text editor
 **/
function richTextSetContent(content)
{
    richTextField.document.getElementsByTagName("body")[0].innerHTML = content;
}

/**
 * Function responsible for manipulating actions on key up in richText
 **/
function onKeyUP()
{
    const richTextFieldText = richTextField.document.getElementsByTagName("body")[0].innerHTML;
    const richTextCurruntLength = richTextFieldText.length;

    $("#richTextCurruntLength").text(richTextCurruntLength);

    processEventEditor();
}

/**
 * Function responsible for manipulating actions on click in richText
 **/
function onClick()
{
    processEventEditor();
}

/**
 * Brand an item in the editor menu how selected
 **/
function setItemMenuSelected(elementID)
{
    document.getElementById(elementID).style.background = "rgba(0, 0, 0, 0.3)";
}

/**
 * Brand an item in the editor menu how unselected
 **/
function unsetItemMenuSelected(elementID)
{
    document.getElementById(elementID).style.background = "rgba(0, 0, 0, 0.0)";
}

/**
 * Check State richTextField
 **/
function checkTextSelectionState(commandState)
{
    if (!document.queryCommandState) {
        return false;
    }

    return richTextField.document.queryCommandState(commandState);

}

/**
 * Function responsible mark a menu item as selected / unselected and process the command
 **/
function execCmd(command)
{
    if (command == "justifyLeft") {
        unsetItemMenuSelected("justifyCenter");
        unsetItemMenuSelected("justifyRight");
    } else if (command == "justifyCenter") {
        unsetItemMenuSelected("justifyLeft");
        unsetItemMenuSelected("justifyRight");
    } else if (command == "justifyRight") {
        unsetItemMenuSelected("justifyLeft");
        unsetItemMenuSelected("justifyCenter");
    }

    $(function() {
        if (checkTextSelectionState(command)) {
            setItemMenuSelected(command);
        } else {
            unsetItemMenuSelected(command);
        }
    });

    execCommandWithArg(command, null);
}

function openSelectColor(params)
{
    // TODO
}

/**
 *
 **/
function execCommandWithArg(command, arg)
{
    document.getElementsByName("richTextField")[0].contentWindow.document.body.focus();

    if (command == "pre") {
        richTextField.document.execCommand("insertHTML", false, `<pre class="richTextPre">${arg}</pre><br>`);
    } else {
        richTextField.document.execCommand(command, false, arg);
    }
}

/**
 * Function responsible for processing link insertion
 **/
function execInsertLink()
{
    const url = document.getElementById("richTextModalInputLink").value;

    $("#richTextModalError").hide();

    if (url == "") {
        $("#richTextModalError").text("Informe uma URL para continuar.");
        $("#richTextModalError").show();
    } else if (url.length < 5) {
        $("#richTextModalError").text("Informe uma URL valida!");
        $("#richTextModalError").show();
    } else {
        execCommandWithArg("createLink", url);
        richTextCloseModal();
    }
}

/**
 * Function responsible for processing image insertion
 **/
function execInsertImage()
{
    const inputImageURL = document.getElementById("richTextModalInputLink").value;
    const image = $("#richTextModalInputUploadImage")[0];

    $("#richTextModalError").hide();

    if (image.files && image.files[0]) {
        // TODO HERE
    } else if (inputImageURL != "") {
        if (inputImageURL.length < 5) {
            $("#richTextModalError").text("Informe uma URL valida!");
            $("#richTextModalError").show();
        } else {
            execCommandWithArg("insertImage", inputImageURL);

            richTextField.document.getElementsByTagName("img")[(richTextField.document.getElementsByTagName("img").length - 1)].style.maxWidth = "100%";

            richTextCloseModal();
        }
    } else {
        $("#richTextModalError").text("Selecione uma imagem para continuar.");
        $("#richTextModalError").show();
    }
}

/**
 * Function responsible for opening the modal of a particular item
 **/
function richTextOpenModal(modal)
{
    switch (modal) {
        case "InsertLink":
            $("#richTextModal").html(contentInsertLink);
            $("#richTextModal").fadeIn();
            break;
        case "InsertImage":
            $("#richTextModal").html(contentInsertImage);
            $("#richTextModal").fadeIn();
            break;
        case "InsertCode":
            execCommandWithArg("pre", "TESTE HAHAHA");
            break;
    }
}

/**
 * Function responsible for closing anyone modal
 **/
function richTextCloseModal()
{
    $("#richTextModal").empty();

    if ($("#richTextModal").is(":visible")) {
        $("#richTextModal").fadeOut();
    }
}

/**
 * Check if string ends with any of array suffixes
 **/
function endsWithAny(suffixes, string)
{
    for (let suffix of suffixes) {
        if (string.endsWith(suffix)) {
            return true;
        }
    }

    return false;
}

/**
 * System ReplaceAll
 **/
String.prototype.replaceAll = function(de, para)
{
    let str = this;
    let pos = str.indexOf(de);

    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }

    return (str);
}

function rgbToHex(str)
{
    const match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);

    if (!match) {
        return "#000000";
    }

    return "#" + (match[3]|match[2]<<8|match[1]<<16|1<<24).toString(16).slice(1)
}
