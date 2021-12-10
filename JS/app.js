//The URIs of the REST endpoint
IUPS = "https://prod-49.northeurope.logic.azure.com:443/workflows/b4ea0cf5106e4bba8b36a57bd9d2a33e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=S3eKmfDFeMwSelJETTnmrSJbQESR0zYb04iE_hZYPyQ";
RAI = "https://prod-89.eastus.logic.azure.com:443/workflows/6b4aa959756c46778be2c74a9f902e3b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W9HOARNm_pZzir1z_EiNEZUIPwKDmAYmLgsExV1D-sc";

DI = "https://prod-43.eastus.logic.azure.com/workflows/3b219605d9a441939a2c2b38c531c3a4/triggers/manual/paths/invoke/";
DI1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jHl-QKWHA9j752By3fWVgDE1-7Iuioo8pzXE2LnLliQ";

filter = "";

BLOB_ACCOUNT = "https://mcnally592.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

    filter = "";
      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 

  $("#filter").click(function(){
    filter = $('#filterOption').val();
    console.log(filter)
    getImages();
  })
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){

  //Create a form data object
  submitData = new FormData();

  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());
  submitData.append('userID', $('#userID').val());
  submitData.append('userName', $('#userName').val());
  submitData.append('File', $("#UpFile")[0].files[0]);
  

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){

    }
  })
 

}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span>');

  $.getJSON(RAI, function( data ){

    //Create an array to hold all the images
    var items = [];

    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function(key, val){
      if(filter == ""){
        items.push("<hr />");
        items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"'width ='400'/><br />")
        items.push("File : " + val["fileName"] + "<br />");
        items.push("Uploaded by: user " + val["userName"] + "(user id: "+val["userID"]+")<br/>");
        //items.push('<button type="button" id= "subNewForm" class="btn btn-danger" onclick="alert' + 'deleteImage('+val["id"] +')">Delete</button> <br/><br/>');
        items.push('<button type="button" id= "subNewForm" class="btn btn-danger" value= "' + val.id + '" onclick="deleteImage(this)">Delete</button> <br/><br/>');
        //items.push('<button type="button" id = updateImage" class="btn btn-primary" onclick="getImageList(' +val,')" >Update Image</button>');
        items.push("<hr />");
      }

      if(val.userID == filter){
        items.push("<hr />");
        items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"'width ='400'/><br />")
        items.push("File : " + val["fileName"] + "<br />");
        items.push("Uploaded by: user " + val["userName"] + "(user id: "+val["userID"]+")<br/>");
        items.push('<button style="color: blueviolet;" type="button" id= "subNewForm" class="btn btn-danger" value= "' + val.id + '" onclick="deleteImage(this)">Delete</button> <br/><br/>');
        items.push("<hr />");

      }

     

    });

    $('#ImageList').empty();

    //Append the contents of the items array to the ImageList Div

    $( "<ul/>",{
      "class": "my-new-list",
      html: items.join( "")
    }).appendTo( "#ImageList");
    });
  
}

function deleteImage(id){
  id = id.value;
  console.log(id);
  $.ajax({

    type: "DELETE",

    url: DI + id + DI1,

  }).done(function( msg ) {
    // On success, update the imageList
    getImages();
  });
}

