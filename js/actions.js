var fn = {
	ready: function(){
		document.addEventListener("deviceready",fn.init,false);
	},
	init: function(){           
        //PARA MOVIL
        if(window.localStorage.getItem("yamigrousuarios") != "SI")
        {          
        fn.btnMigrarUsuarios();  
        }
        ////////////
 
        if(fn.estaRegistrado() == false)
        {
        window.location.href = '#login';      
        }
        else
        {
        $("#lblorigenactual").text("Tu Ubicación: " + window.localStorage.getItem("origen"));
        window.location.href = '#IngresoCubo';     
        }
		// LOGEO EN EL SERVIDOR --> $('#btnautentificar').tap(fn.autentificar);
        //PARA WEB
        //$('#btnautentificar').tap(fn.autentificarJSON);
        ////////////
        //PARA MOVIL
        $('#btnautentificar').tap(fn.autentificarSQL);
        ////////////
        $('#CerrarSesion').tap(fn.cerrarsesion);
		$('#CSOC').tap(fn.cerrarsesion);
        $('#ConsultarCUBO').tap(fn.ConsultarCUBO);
		$('#ConsultarOC').tap(fn.ConsultarOrdenCompra);
        $('#ConsultaNumUsuarios').tap(fn.ConsultaNumUsuarios);
        //$('#btnMigrarUsuarios').tap(fn.btnMigrarUsuarios);
        $('#btnEliminarUsuarios').tap(fn.btnEliminarUsuarios);
        $('#btnabortar').tap(fn.btnabortar);
		$('#btnCancelar').tap(fn.btnCancelar);
        $('#ConsultarCUBOC').tap(fn.ConsultarCUBOC);
        $('#ConsultarAlmacenesXCUBO').tap(fn.ConsultarAlmacenesXCUBO);
        $('#MARCAR').tap(fn.MARCAR);
		$("#MarcaOC").tap(fn.MarcarOC);       
        
        //PARA MOVIL
        document.addEventListener("online", fn.btnMigrarUsuarios(), false);
        ////////////
 
	},
    autentificarJSON : function() {    
  
    var usuariof = $('#txtusuario').val();
    var passf =   $('#txtcontrasena').val();  
    var out = "";
    var i;
    var encontrado = "false";
    //alert("hola1");
    for(i = 0; i<usuarios.length; i++) {
        if(( usuarios[i].usuario == usuariof) && (usuarios[i].pass == passf)){
        window.localStorage.setItem("user",usuariof);
        window.localStorage.setItem("origen",usuarios[i].origen);
        $("#lblorigenactual").text("Tu Ubicación: " + window.localStorage.getItem("origen"));
        $("#txtcubo").val("");

        //alert(""+usuariof);
        window.location.href = '#IngresoCubo';
        encontrado = "true";
        break;
        }        
        //alert("hola" + myArray.length);
        //out += '<a href="' + myArray[i].usuario + '">' + myArray[i].pass + '</a><br>';
    }
    if(encontrado == "false")
    {
     //alert("Verifique el usuario y la contraseña"); ///*PARAWEB
     navigator.notification.alert("Verifique el usuario y la contraseña",null,"Error al Ingresar","Aceptar");  ///*PARAMOVIL
    }
    //document.getElementById("id01").innerHTML = out;
    },
     estaRegistrado: function(){
        var usr = window.localStorage.getItem("user");
        if(usr == undefined || usr == '' || usr == null)
        {
            return false;
        }
        else
        {
            return false;
        }
    },
    cerrarsesion: function(){
		window.localStorage.setItem("user",'');   
		$("#txtusuario").val("");
		$("#txtcontrasena").val("");
		$('#txtTipo').val("");
		window.location.href = '#login'
		location.reload();
    },	
	ConsultarOrdenCompra: function(){
		var digitado = $('#txtOC').val();
		var division = digitado.substring(0,2);
		var OC = digitado.substring(2);
		var origen = window.localStorage.getItem("origen");
		
		if(division != '' && OC != ''){
			$.mobile.loading("show",{theme: 'b'});
			$.ajax({
				method: 'POST',
				url: 'http://servidoriis.laitaliana.com.mx/PO/WebServices/OC/OC.asmx/ocs',
				data: {OC: OC, Division: division, Usuario: origen},
				dataType: "json",
				success: function (msg){
					$.mobile.loading("hide");
					$.each(msg, function(i,item){
						if(msg[i].RESPUESTA == 'CORRECTO'){
							//alert(msg[i].OC + ' ' + msg[i].DIVISION + ' ' + msg[i].NUMPROV + ' ' + msg[i].NOMPROV + ' ' + msg[i].IMPORTE + ' ' + msg[i].ALMACEN);
							$("#doc").text(msg[i].DIVISION);
							$("#foc").text(msg[i].OC);
							$("#nump").text(msg[i].NUMPROV);
							$("#nomp").text(msg[i].NOMPROV);
							$("#ioc").text(msg[i].IMPORTE);
							$("#aoc").text(msg[i].ALMACEN);
							window.location.href = '#Info'
						}else if(msg[i].RESPUESTA == 'INCORRECTO1'){
							navigator.notification.alert("Almacen de Orden de Compra, no Requiere Reporte Vigilancia, se aborta la operación.",null,"Status de OC incorrecto.","Aceptar");
						}else if(msg[i].RESPUESTA == 'INCORRECTO2'){
							navigator.notification.alert("EL STATUS de Orden de Compra no es Vigilancia, se aborta la operación.",null,"Status de OC incorrecto.","Aceptar");
						}
						
					});
				},
				error: function(jq, txt){
					$.mobile.loading("hide");
					navigator.notification.alert("Verifique su conexion de Datos ó Wifi " + jq + " " + txt.responseText,null,"Error al Consultar OC","Aceptar");
				}
			});
		}else{
			navigator.notification.alert("División y OC son Requeridos",null,"Error al Consultar OC","Aceptar");
		}
	},
    ConsultarCUBO: function(){    

        var cubo = $('#txtcubo').val();    
        var origen = window.localStorage.getItem("origen");   
        
        if(cubo != ''){ 
         
            $.mobile.loading("show",{theme: 'b'});
            $.ajax({
                method: 'POST',
                url: 'http://servidoriis.laitaliana.com.mx/LM/wsitamarcarunidades/Service1.asmx/MuestraInfoCubo',              
                data: {cubo: cubo, origen: origen},
                dataType: "json",
                success: function (msg){
                    $.mobile.loading("hide");

                    $.each(msg,function(i,item){
                       
                        if(msg[i].Respuesta == "encontro")
                            {      
                            //alert("SS1");                  
                            if(msg[i].status != "P")
                            {
                                //alert("El STATUS del cubo no es programado, se aborta la operacion."); ///*PARAWEB
                                navigator.notification.alert("El STATUS del cubo no es programado, se aborta la operacion.",null,"Status del CUBO incorrecto.","Aceptar");///*PARAMOVIL
                            }                            
                            else
                            {                 
                                window.location.href = '#MuestraInfoCubo';
                                $("#hFOLIOCUBO").text($('#txtcubo').val());
                                $("#hORIGENUSUARIO").text(window.localStorage.getItem("origen"));
                                $("#hNPROVEEDOR").text(msg[i].vendor_name);
                                $("#hPLACA").text(msg[i].tm_vehicle_id);
                                $("#hDESCRIPCIONCUBO").text(msg[i].description);

                                $("#btnMARCAR_PK").text(msg[i].ANDEN_FISICO);
                            }

                            }
                        else if(msg[i].Respuesta == "noencontro")
                            {
                            //alert("No se encontro información del CUBO relacionada con el almacén fisico: " + origen); ///*PARAWEB
                            navigator.notification.alert("No se encontro información del CUBO relacionada con el almacén fisico: " + origen,null,"No Existe en la Base de datos.","Aceptar");///*PARAMOVIL
                            }                        
                    });                 
                },
                error: function(jq, txt){
                    $.mobile.loading("hide");
                    //alert("Verifique su conexion Celular ó Wifi " + jq + txt.responseText); ///*PARAWEB
                    navigator.notification.alert("Verifique su conexion Celular ó Wifi " + jq + txt.responseText,null,"Error al consultar CUBO","Aceptar");///*PARAMOVIL
                }
            });
        }
        else{
            navigator.notification.alert("El CUBO es Requeridos",null,"Error al consultar CUBO","Aceptar");///*PARAMOVIL
            //alert("El CUBO es Requeridos");///*PARAWEB
        }  
    },
        ConsultarCUBOC: function(){    

        var cubo = $('#txtcuboC').val();   

        if(cubo != ''){ 
         
            $.mobile.loading("show",{theme: 'b'});
            $.ajax({
                method: 'POST',
                url: 'http://servidoriis.laitaliana.com.mx/LM/wsitamarcarunidades/Service1.asmx/MuestraInfoCuboV2',              
                data: {cubo: cubo},
                dataType: "json",
                success: function (msg){
                    $.mobile.loading("hide");
                    $("#btnCMARCAR_PK").text("");
                    $.each(msg,function(i,item){
                        
                        if(msg[i].Respuesta == "encontro")
                            {      
               
                                               
                                $("#hCSTATUS").text(msg[i].status);
                                $("#hCORIGENUSUARIO").text(window.localStorage.getItem("origen"));
                                $("#hCNPROVEEDOR").text(msg[i].vendor_name);
                                $("#hCPLACA").text(msg[i].tm_vehicle_id);
                                $("#hCDESCRIPCIONCUBO").text(msg[i].description);

                                $("#btnCMARCAR_PK").append((i+1) + ".- "+msg[i].ANDEN_FISICO + "<BR>");
                            

                            }
                        else if(msg[i].Respuesta == "noencontro")
                            {
                            //alert("No se encontro información del CUBO en la base de datos.");///*PARAWEB
                            navigator.notification.alert("No se encontro información del CUBO en la base de datos." ,null,"No Existe en la Base de datos.","Aceptar");///*PARAMOVIL

                            }                        
                    });                 
                },
                error: function(jq, txt){
                    $.mobile.loading("hide");
                    //alert("Verifique su conexion Celular ó Wifi " + jq + txt.responseText);///*PARAWEB
                    navigator.notification.alert("Verifique su conexion Celular ó Wifi " + jq + txt.responseText,null,"Error al consultar CUBO","Aceptar");///*PARAMOVIL
                }
            });
        }
        else{
            navigator.notification.alert("El CUBO es Requeridos",null,"Error al consultar CUBO","Aceptar");///*PARAMOVIL
            //alert("El CUBO es Requeridos");///*PARAWEB
        }  
    },
    ConsultaNumUsuarios: function(){      
        almacen.leerNumeroUsuarios();     
        window.location.href = '#RemotaALocal';
    
    },
    btnMigrarUsuarios: function(){ 
        if(window.localStorage.getItem("yamigrousuarios") != "SI")
        {         
        var myArray = new Array(30); 
        var registros = $('#NumUsuarios').val();  
        if(registros == 0)
            {
                $.mobile.loading("show",{theme: 'b'});
                $.ajax({
                method: 'POST',
                url: 'http://servidoriis.laitaliana.com.mx/LM/wsitamarcarunidades/Service1.asmx/enviarcatalogocompletodeusuarios',              
                //data: {usuario: nom, contrasena: passw},
                dataType: "json",
                success: function (msg){
                    $.mobile.loading("hide");
                    $.each(msg,function(i,item){
                        myArray[i] = msg[i].usuario + "','" + msg[i].pass + "','" + msg[i].origen;
                    }); 
                    almacen.guardarUsuario(myArray);
                    almacen.leerNumeroUsuarios();  
                    window.localStorage.setItem("yamigrousuarios","SI");
                    navigator.notification.alert("Migración Correcta de Usuarios",null,"Listo","Aceptar");               
        },
        error: function(jq, txt){
                    //alert("Error al migrar los usuarios del servidor, cierre y vuelva a abrir la aplicación para reintentar actualizar ó verifique su cobertura" +jq + txt.responseText);///*PARAWEB
                    navigator.notification.alert("Error al migrar los usuarios del servidor, cierre y vuelva a abrir la aplicación para reintentar actualizar ó verifique su cobertura" + jq + txt.responseText,null,"Error al migrar verifique su cobertura","Aceptar");///*PARAMOVIL
                }
            });
                    //navigator.notification.alert("a guardar",null,"Error al Ingresar","Aceptar");    
                            //almacen.guardarEXT(fn.id_ext, fn.ubicacion,fn.capacidad,fn.clase,fn.agente,fn.marca,fn.frecarga,fn.ffabricacion,fn.fproxservicio);
                    
                    }
                    else
                    {
                       //alert("Se tienen registros en la base de datos, antes eliminelos"); ///*PARAWEB
                       navigator.notification.alert("Se tienen registros en la base de datos, antes eliminelos",null,"Advertencia","Aceptar");///*PARAMOVIL    
                    }
        }
    },
    btnEliminarUsuarios: function(){        
            almacen.eliminarUsuarios();
            almacen.leerNumeroUsuarios();  
    },
    autentificarSQL: function(){
        var usu = $('#txtusuario').val();      
        var con = $('#txtcontrasena').val(); 
		var tip = $('#txtTipo').val();
        if((usu != '') && (con != '') && (tip != '')){  
            $.mobile.loading("show",{theme: 'b'});
            almacen.leerinformacionUsuario();
            $.mobile.loading("hide");
        }
        else
		{
            navigator.notification.alert("Ingrese los datos requeridos",null,"Error al Ingresar","Aceptar");///*PARAMOVIL
            //alert("Ingrese los datos requeridos");///*PARAWEB
        }   
    },
    btnabortar: function(){
        $("#txtcubo").val("");
    },
	btnCancelar: function(){
		$("#txtOC").val("");	
	},
    ConsultarAlmacenesXCUBO: function(){
         $("#hCSTATUS").text("");
          $("#hCORIGENUSUARIO").text("");
           $("#hCNPROVEEDOR").text("");
            $("#hCPLACA").text("");
             $("#hCDESCRIPCIONCUBO").text("");
             $("#btnCMARCAR_PK").text("");
             $("#txtcuboC").val("");
    },
	MarcarOC: function(){
		var OrdenC = $('#foc').text();
		var Div = $("#doc").text();
		var usuario = window.localStorage.getItem("user");
		
		$.mobile.loading("show",{theme: 'b'});
		$.ajax({
			method: 'POST',
			url: 'http://servidoriis.laitaliana.com.mx/PO/WebServices/OC/OC.asmx/marcaOC',
			data: {OC: OrdenC, Division: Div, Usuario: usuario},
			dataType: "json",
			success: function(msg){
				$.mobile.loading("hide");
				$.each(msg, function(i,item){
					if(msg[i].RESPUESTA == "CORRECTO"){
						$("#doc").text("");
						$("#foc").text("");
						$("#nump").text("");
						$("#nomp").text("");
						$("#ioc").text("");
						$("#aoc").text("");
						$("#txtOC").val("");
						window.location.href = '#OC';
						navigator.notification.alert("Se registro de forma Correcta.",null,"Correcto","Aceptar");
					}else if(msg[i].RESPUESTA == "INCORRECTO1"){
						$("#doc").text("");
						$("#foc").text("");
						$("#nump").text("");
						$("#nomp").text("");
						$("#ioc").text("");
						$("#aoc").text("");
						$("#txtOC").val("");
						window.location.href = '#OC';
						navigator.notification.alert("Se se tiene informacion de registro para esta OC.",null,"Incorrecto","Aceptar");
					}else if(msg[i].RESPUESTA == "INCORRECTO2"){
						$("#doc").text("");
						$("#foc").text("");
						$("#nump").text("");
						$("#nomp").text("");
						$("#ioc").text("");
						$("#aoc").text("");
						$("#txtOC").val("");
						window.location.href = '#OC';
						navigator.notification.alert("Ocurrio algun Error en Web Services, Verifique con Sistemas.",null,"Incorrecto","Aceptar");
					}
				});
			},
			error: function(jq,txt){
				navigator.notification.alert("Error al intentar marcar verifique su cobertura ó contacte a sistemas " + jq + ' ' + txt.responseText,null,"Error al Marcar Verifique su cobertura","Aceptar");
			}
		});
	},
    MARCAR: function(){

        var cubo = $('#hFOLIOCUBO').text();  
        var usuario = window.localStorage.getItem("user");
        var origen = window.localStorage.getItem("origen");


                $.mobile.loading("show",{theme: 'b'});
                $.ajax({
                method: 'POST',
                url: 'http://servidoriis.laitaliana.com.mx/LM/wsitamarcarunidades/Service1.asmx/GuardaReporte',              
                data: {cubo: cubo, usuario: usuario, origen: origen},
                dataType: "json",
                success: function (msg){
                    $.mobile.loading("hide");
                    $.each(msg,function(i,item){
                       if(msg[i].Respuesta == "correcto")
                            {       
                            window.location.href = '#IngresoCubo';
                                $("#hFOLIOCUBO").text("");
                                $("#hORIGENUSUARIO").text("");
                                $("#hNPROVEEDOR").text("");
                                $("#hPLACA").text("");
                                $("#hDESCRIPCIONCUBO").text("");
                                $("#btnMARCAR_PK").text(""); 
                                $("#txtcubo").val("");                                        
                                //alert("Se registro de forma correcta.");///*PARAWEB
                                navigator.notification.alert("Se registro de forma correcta.",null,"Listo","Aceptar");///*PARAMOVIL                                    
                            }
                            else if(msg[i].Respuesta == "yaseregistro")
                            {    
                            window.location.href = '#IngresoCubo';
                                $("#hFOLIOCUBO").text("");
                                $("#hORIGENUSUARIO").text("");
                                $("#hNPROVEEDOR").text("");
                                $("#hPLACA").text("");
                                $("#hDESCRIPCIONCUBO").text("");
                                $("#btnMARCAR_PK").text("");  
                                $("#txtcubo").val("");                              
                                //alert("Ya se tiene información de registro para este almacén.");///*PARAWEB
                                navigator.notification.alert("Ya se tiene información de registro para este almacén.",null,"Listo","Aceptar");  ///*PARAMOVIL                            
                            }
                            else if(msg[i].Respuesta == "incorrecto")
                            {                
                            window.location.href = '#IngresoCubo';
                                $("#hFOLIOCUBO").text("");
                                $("#hORIGENUSUARIO").text("");
                                $("#hNPROVEEDOR").text("");
                                $("#hPLACA").text("");
                                $("#hDESCRIPCIONCUBO").text("");
                                $("#btnMARCAR_PK").text("");                                   
                                $("#txtcubo").val("");                
                                //alert("Sin información que registrar o actualziar verifique con sistemas.");///*PARAWEB
                                navigator.notification.alert("Sin información que registrar o actualziar verifique con sistemas.",null,"Listo","Aceptar");///*PARAMOVIL
                            }
                                         
                    }); 

                                   
        },
        error: function(jq, txt){           
                    //alert("Error al intentar marcar verifique su cobertura ó contacte a sistemas"+jq + txt.responseText);///*PARAWEB
                    navigator.notification.alert("Error al intentar marcar verifique su cobertura ó contacte a sistemas" + jq + txt.responseText,null,"Error al migrar verifique su cobertura","Aceptar");///*PARAMOVIL
                }
            });
                    //navigator.notification.alert("a guardar",null,"Error al Ingresar","Aceptar");    
                            //almacen.guardarEXT(fn.id_ext, fn.ubicacion,fn.capacidad,fn.clase,fn.agente,fn.marca,fn.frecarga,fn.ffabricacion,fn.fproxservicio);
                    
                  
    }

};
//$(fn.init);
$(fn.ready);