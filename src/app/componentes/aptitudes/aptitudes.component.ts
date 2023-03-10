import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { PortfolioService } from 'src/app/servicios/portfolio.service';
import { aptitud } from 'src/app/models/aptitud';
import { FormArray, FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { formatDate } from '@angular/common'

@Component({ 
  selector: 'app-aptitudes',
  templateUrl: './aptitudes.component.html',
  styleUrls: ['./aptitudes.component.css']
})

export class AptitudesComponent implements OnInit {
  aptitudesList: aptitud[] = [];
  form:FormGroup;
  form2:FormGroup;
  id_per: number;
  @Input() aptitud: aptitud = new aptitud();
  @Output() deleteItem:EventEmitter<aptitud> = new EventEmitter;
  errorMessage = '';

  constructor(private datosPortfolio:PortfolioService, private formBuilder:FormBuilder, 
    private modal: NgbModal, private modal2: NgbModal) {
      this.form = this.formBuilder.group({
           id_tec:[0],
           skill:[''],
           porc:[0],
           personaId:[0],
        });
       this.form2 = this.formBuilder.group({
         id_tec:[0],
         skill:['',[Validators.required]],
         porc:[0,[Validators.required]],
         personaId:[0],
        });    
        this.id_per = 0;
  }

  ngOnInit(): void { 
    this.datosPortfolio.obtenerApt().subscribe(data =>{
      console.log ("Aptitudes" + JSON.stringify(data));
    this.aptitudesList = data;    
    })
    this.datosPortfolio.obtenerDatos().subscribe(data =>{
      console.log ("Datos Personales" + JSON.stringify(data));
      this.id_per = data.id_per;
    })
  }
  borrarItem(aptitud:aptitud){     
   this.borrarAptLista(aptitud);
  }

  borrarAptLista(aptitud:aptitud){
    // aca tengo que llamar al service para actualizar la base de datos, mientras tanto actualizo la lista 
    console.log(JSON.stringify(aptitud.id_tec));
    this.datosPortfolio.deleteAptitud(aptitud.id_tec).subscribe(
      //(response: any) => {
     {
      next: data => {
        this.modal.dismissAll();
        window.location.reload();
      },
      error: err =>{
        alert('Error al Eliminar');
        this.errorMessage = err.error.message;
      }  

    });     
  }

  openPopPup(aptitud:aptitud,contenido:any){

     console.log(JSON.stringify(aptitud)) 
     this.form.controls['id_tec'].setValue(aptitud.id_tec);
     this.form.controls['skill'].setValue(aptitud.skill);
     this.form.controls['porc'].setValue(aptitud.porc);
     this.form.controls['personaId'].setValue(aptitud.personaId);
     this.modal.open(contenido, {
      centered: true,
      backdrop: 'static',
      size:'sm'
     });
  }
 

  guardarCambios(aptitud:aptitud){
      console.log(this.form.controls['id_tec'].get)
    
      aptitud.skill = this.form.controls['skill'].value;
      if (this.form.controls['porc'].value > 100 ){
        this.aptitud.porc = 100; 
      }else{
        if ((this.form.controls['porc'].value < 10) || (this.form.controls['porc'].value < ' ' )){
          this.aptitud.porc = 10;
        }else{
          this.aptitud.porc = this.form.controls['porc'].value;
        }
      }   
    
    
    
    this.form.controls['personaId'].setValue(this.id_per);
    this.form.controls['porc'].setValue(this.aptitud.porc);
    this.datosPortfolio.guardarAptitud(this.form.value).subscribe(
      //(response: any) => {
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

  agregarItem(contenido2:any){
    this.form2.controls['skill'].setValue("");
    this.form2.controls['porc'].setValue("");
    this.modal2.open(contenido2, {
      centered: true,
      backdrop: 'static',
      size:'sm'
     });
  }

  agregarAptitud(event:Event){
    this.form2.controls['personaId'].setValue(this.id_per);
    console.log(this.form2.value)
    this.datosPortfolio.agregarAptitud(this.form2.value).subscribe(
      //(response: any) => {
   {
    next: data => {
      this.modal.dismissAll();
      window.location.reload();
    },
    error: err =>{
      alert('Error al agregar');
      this.errorMessage = err.error.message;
    }  

    });
  }
}
