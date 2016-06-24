document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var that = this,
		App = new downloadApp();
		//fileName = "sample.png",
		//uri = encodeURI("http://www.telerik.com/sfimages/default-source/logos/app_builder.png"),
		//folderName = "test";
    
	//navigator.splashscreen.hide();
	//App.run(uri, fileName, folderName);
	App.run();
}

var downloadApp = function() {
}

downloadApp.prototype = {

    rst: null,

    run: function () {
        //rst = document.getElementById("result");
		var that = this,
			filePath = "";
        
		/*document.getElementById("download").addEventListener("click", function() {
			that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");
                    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							filePath = folder.toURL() + "\/" + fileName;
							that.transferFile(uri, filePath)
						}, function() {
							console.log("failed to get folder");
						});
					} else {
						var filePath;
						var urlPath = fileSystem.root.toURL();
						if (device.platform == "Win32NT") {
							urlPath = fileSystem.root.fullPath;
						}
						if (parseFloat(device.cordova) <= 3.2) {
							filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/" + fileName;
						} else {
							filePath = urlPath + "\/" + fileName;
						}
						that.transferFile(uri, filePath)
					}
				},
				function() {
					console.log("failed to get filesystem");
				}
				);
		});*/
		
		document.getElementById("uploadcheque").addEventListener("click", that.uploadFile);
		document.getElementById("uploaddoorlock").addEventListener("click", that.uploadFile);
	},
    
	getFilesystem:function (success, fail) {
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
	},

	getFolder: function (fileSystem, folderName, success, fail) {
		fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
	},

	transferFile: function (uri, filePath) {
		var transfer = new FileTransfer();
		transfer.download(
			uri,
			filePath,
			function(entry) {
				var targetPath = entry.toURL();
				if (device.platform == "Win32NT") {
					targetPath = entry.fullPath;
				}
				var image = document.getElementById("downloadedImage");
				image.src = targetPath;
				image.style.display = "block";
				image.display = targetPath;
				//rst.innerHTML = "File saved to: " + targetPath;
			},
			function(error) {
			   // rst.innerHTML = "An error has occurred: Code = " + error.code;
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code" + error.code);
			}
			);
	},
	
	uploadFile: function () {
   	    console.log("Upload File - step 1");
       if (device.platform === 'Android') {
          setInterval(function () {
          cordova.exec(null, null, '', '', [])
          }, 200);
        }     
        rst = document.getElementById(this.id + 'res');
	    rst.innerHTML = "";
        var uploadTYPE = this.id;
   	    console.log("Upload File - calling getPicture");
		navigator.camera.getPicture(
			uploadPhoto,
			function(message) {
			    rst.innerHTML = "Failed to get a picture. Please select one.";
			}, {
				quality         : 50,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				sourceType      : navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                encodingType: navigator.camera.EncodingType.JPEG,
                mediaType: navigator.camera.MediaType.Picture
			});
		
		function uploadPhoto(fileURI) {
   	    console.log("Upload Photo - step 1");
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
   	    console.log("Upload Photo - step 2");
			
			if (cordova.platformId == "android") {
				options.fileName += ".jpg" 
			}
			
			options.mimeType = "image/jpeg";
            //options.httpMethod = "PUT";
            //options.contentType = 'multipart/form-data';
            var params = new Object();
            params.uid = localStorage.getItem("FOSCode");
            params.utyp = uploadTYPE;
			options.params = params; 
            
			options.headers = {
				Connection: "close"
			};
            //options.httpMethod = 'POST';
			options.chunkedMode = false;

   	    console.log("Upload Photo - step 3");
			var ft = new FileTransfer();

			rst.innerHTML = "Upload in progress...";
			ft.upload(
				fileURI,
				encodeURI("https://www.kinrep.com/foster/upload.php"),
				onFileUploadSuccess,
				onFileTransferFail,
				options, true);
		
			function onFileUploadSuccess (result) {
               // rst.innerHTML = "Upload successful";
				console.log("FileTransfer.upload");
				console.log("Code = " + result.responseCode);
				console.log("Response = " + result.response);
				console.log("Sent = " + result.bytesSent);
				console.log("Link to uploaded file: https://www.kinrep.com/foster/ws/contentlibrary/" + result.response);
				var response = result.response;
				var destination = "https://www.kinrep.com/foster/WS/ContentLibrary/" + response.substr(response.lastIndexOf('=') + 1);
                if(this.id == 'uploadcheque') {
                    document.getElementById("hdnchequeimgpath").value = destination;
                    
                } else if(this.id == 'uploaddoorlock') {
                    
                    document.getElementById("hdndoorlockedimgpath").value = destination;
                } else {
                    
                    document.getElementById("hdnothersimgpath").value = destination;
                }
				rst.innerHTML = "File uploaded to: " +
															  destination + 
															  "</br><button class=\"button\" onclick=\"window.open('" + destination + "', '_blank', 'location=yes')\">Open Location</button>";
				//document.getElementById("downloadedImage").style.display="none";
			}
        
			function onFileTransferFail (error) {
                
                rst.innerHTML = "File Transfer failed: " + error.code;
                alert(rst.innerHTML);
				console.log("FileTransfer Error:");
				console.log("Code: " + error.code);
				console.log("Source: " + error.source);
				console.log("Target: " + error.target);
			}
   	    console.log("Upload Photo - step 4 - end");
		}
	}
}