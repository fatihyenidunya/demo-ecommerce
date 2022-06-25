import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './__auth/auth.guard';
import { UserService } from './__auth/user.service';
import { AppConnections } from './app.connections';
import { SmsComponent } from './sms.component';

// import { FormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { UserService } from './shared/services/user.service';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { ConfirmationDialogService } from './__confirm/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './__confirm/confirmation-dialog.component';
import { NgbdModalContent } from './__server-error/server-error.component';


const dbConfig: DBConfig = {
  name: 'oDb',
  version: 1,
  objectStoresMeta: [{
    store: 'users',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'oUserId', keypath: 'oUserId', options: { unique: false } },
      { name: 'oUserToken', keypath: 'oUserToken', options: { unique: false } },
      { name: 'oUserName', keypath: 'oUserName', options: { unique: false } },
      { name: 'oUserRole', keypath: 'oUserRole', options: { unique: false } }
    ]
  }]
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LanguageTranslationModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    // FormsModule,
    NgxIndexedDBModule.forRoot(dbConfig)


  ],
  declarations: [AppComponent,ConfirmationDialogComponent,NgbdModalContent],
  providers: [AppConnections,ConfirmationDialogService, AuthGuard,SmsComponent, UserService],
  entryComponents:[ConfirmationDialogComponent,NgbdModalContent],

  bootstrap: [AppComponent]
})
export class AppModule { }
