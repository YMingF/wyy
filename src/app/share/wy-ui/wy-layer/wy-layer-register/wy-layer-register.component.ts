import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
})
export class WyLayerRegisterComponent implements OnInit {
  formModel: FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.setModel()
  }
  onSubmit() {}
  setModel() {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
}
