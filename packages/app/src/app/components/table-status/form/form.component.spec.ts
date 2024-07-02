import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStatusFormComponent } from './form.component';

describe('FormComponent', () => {
  let component: TableStatusFormComponent;
  let fixture: ComponentFixture<TableStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableStatusFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
