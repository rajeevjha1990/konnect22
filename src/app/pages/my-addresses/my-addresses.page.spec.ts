import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAddressesPage } from './my-addresses.page';

describe('MyAddressesPage', () => {
  let component: MyAddressesPage;
  let fixture: ComponentFixture<MyAddressesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAddressesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
