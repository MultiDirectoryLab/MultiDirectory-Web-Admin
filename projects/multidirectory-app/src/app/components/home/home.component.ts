import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { WhoamiResponse } from "../../models/whoami/whoami-response";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    tree = [{
        name: 'root1', 
        icon: '',
        expanded: false,
        children: [
          {
            name: 'child1',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child11',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child12',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
          {
            name: 'child2',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child21',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child22',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
        ]
      },
      {
        name: 'root2', 
        icon: '',
        expanded: false,
        children: [
          {
            name: 'child1',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child11',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child12',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
          {
            name: 'child2',
            icon: '',
            expanded: false,
            children: [
              {
                name: 'child21',
                icon: '',
                expanded: false,
                children: null
              },
              {
                name: 'child22',
                icon: '',
                expanded: false,
                children: null
              }
            ]
          },
        ]
      }
    ];

    public user?: WhoamiResponse;
    
    constructor(private router: Router, private api: MultidirectoryApiService) {
      this.api.whoami().subscribe(whoami=> {
        this.user = whoami;
      });
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login'])
    }

}