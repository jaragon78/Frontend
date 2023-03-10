import { Component, OnInit } from '@angular/core';
import { PortfolioService } from 'src/app/servicios/portfolio.service';
import { Router } from '@angular/router';
import { Persona } from 'src/app/models/Persona';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { formatDate } from '@angular/common'
import { AuthService } from 'src/app/_services/auth.service';
import { Educacion } from 'src/app/models/Educacion';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  persona: Persona;
  form:FormGroup;
  form2:FormGroup;
  errorMessage = '';
  displayStyle = "none";

  constructor(private datosPortfolio:PortfolioService,  private ruta:Router, private authService:AuthService,
    private formBuilder:FormBuilder, private modal: NgbModal) { 
      this.persona = new Persona();
      this.form = this.formBuilder.group({
        id_per:[0],
        nombre:[''],
        apellido:[''],
        fechaNac:[''],
        telefono:[''],
        sobre_mi:[''],
        correo:[''],
        url_foto:[''],
        url_fondo:['']
      });
      this.form2 = this.formBuilder.group({
        id_per:[0],
        nombre:[''],
        apellido:[''],
        fechaNac:[''],
        telefono:[''],
        sobre_mi:[''],
        correo:[''],
        url_foto:[''],
        url_fondo:['']
      });        
    }

  ngOnInit(): void {
    console.log ("Encabezado");
    this.datosPortfolio.obtenerDatos().subscribe(data =>{
      console.log ("Encabezado" + JSON.stringify(data));
      this.persona.id_per = data.id_per;
      this.persona.nombre = data.nombre;
      this.persona.apellido = data.apellido;
      this.persona.fechaNac = data.fechaNac;
      this.persona.telefono = data.telefono;
      this.persona.sobre_mi = data.sobre_mi;
      this.persona.correo = data.correo;
      this.persona.url_foto = data.url_foto;
      this.persona.url_fondo = data.url_fondo;
    } );
  }
 
  closePopup() {
    this.displayStyle = "none";
  }


  openPopPup(contenido:any){
    this.form.controls['id_per'].setValue(this.persona.id_per);
    this.form.controls['nombre'].setValue(this.persona.nombre);
    this.form.controls['apellido'].setValue(this.persona.apellido);
    let fecha = new Date(this.persona.fechaNac);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
    this.form.controls['fechaNac'].setValue(formatDate(fecha,'yyyy-MM-dd','en'));
    this.form.controls['telefono'].setValue(this.persona.telefono);
    this.form.controls['sobre_mi'].setValue(this.persona.sobre_mi);
    this.form.controls['correo'].setValue(this.persona.correo);
    this.form.controls['url_foto'].setValue(this.persona.url_foto);
    this.form.controls['url_fondo'].setValue(this.persona.url_fondo);
    this.modal.open(contenido,{size:'xl'})
  }
  
  openContacto(contenido2:any){
    this.form2.controls['telefono'].setValue(this.persona.telefono);
    this.form2.controls['telefono'].disable();
    this.form2.controls['correo'].setValue(this.persona.correo);
    this.form2.controls['correo'].disable();
    this.modal.open(contenido2, {
      centered: true,
      backdrop: 'static',
      size:'md'
     });

  }

  guardarCambios():void{

    this.datosPortfolio.guardarPersona(this.form.value).subscribe(
     // (response: any) => {    
    {
      next: data => {
        this.modal.dismissAll();
        window.location.reload();
      },
      error: err =>{
        alert('Error al modificar');
        this.errorMessage = err.error.message;
      }  
  
  });
  }

}
