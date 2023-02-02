import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  formEmployee: FormGroup;
  disabled: boolean = true
  rowData: any = []

  id: Number = 0
  name: string = ''
  position: string = ''
  salary: string = ''
  picture: string = ''

  columnDefs = [
    { field: 'id', filter: 'agNumberColumnFilter', width: 100 },
    { field: 'Name', filter: 'agTextColumnFilter', width: 150 },
    { field: 'Position', filter: 'agTextColumnFilter', width: 150 },
    { field: 'Salary', filter: 'agTextColumnFilter', width: 150 },
    { field: 'CreationDate', filter: 'agTextColumnFilter', width: 150 },
    { field: 'Picture', filter: 'agTextColumnFilter' },
  ]


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formEmployee = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', Validators.required],
      photo: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.GetData()
  }

  rowDoubleClicked(event: RowDoubleClickedEvent) {
    this.id = event.data.id
    this.name = event.data.Name
    this.position = event.data.Position
    this.salary = event.data.Salary
    this.picture = event.data.Picture
  }

  async GetData() {
    var config = {
      method: 'get',
      url: 'http://ec2-18-206-207-180.compute-1.amazonaws.com/api/employee?skip=0&limit=100',
      headers: {}
    };
    var { data } = await axios(config)
    this.rowData = data.data
  }

  save(method: string) {
    if (
      this.name &&
      this.position &&
      this.salary &&
      this.picture
    ) {
      var config = {
        method: method,
        url: 'http://ec2-18-206-207-180.compute-1.amazonaws.com/api/employee' + (method == 'delete' ? `/${this.id}`:''),
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "parameter": {
            "id": this.id,
            "picture": this.picture,
            "name": this.name,
            "position": this.position,
            "salary": this.salary
          }
        })
      };

      console.log(config)

      axios(config)
        .then((response) => {
          var action = ''
          switch (method) {
            case 'post':
              action = 'guardado'
              break
            case 'put':
              action = 'actualizado'
              break
            case 'delete':
              action = 'eliminado'
              break
            default:
              action = ''
              break
          }
          this.toastr.success(`Cliente ${action} con exito`, "Success")
        })
        .catch(function (error) {
          console.log(error);
        }).finally(() => {
          this.id = 0
          this.name = ''
          this.position = ''
          this.salary = ''
          this.picture = ''
          this.GetData()
        })
    }
    else {
      this.toastr.error("Faltan datos en el formulario", "Error")
    }
  }

}
