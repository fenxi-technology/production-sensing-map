import {HttpDataProvider} from './../../providers/http-data/http-data';
import {
  Component
} from "@angular/core";
import {App, AppStatus} from "./app";
import {DomSanitizer} from "@angular/platform-browser";
import {LocalStorage, SharedStorage} from "ngx-store";
import {CookieService} from "ngx-cookie";

/**
 * Generated class for the AppiconWidgetComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "appicon-widget",
  templateUrl: "appicon-widget.html"
})
export class AppiconWidgetComponent {
  @SharedStorage('chosenApps') chosenApps: Array<App>;
  apps: App[];
  public smokescreen: boolean = false;
  @LocalStorage() positionArray: string = "";
  itemStyles: Array<{ transform: any }>;

  constructor(public sanitizer: DomSanitizer, private dataProvider: HttpDataProvider, private cookieService: CookieService) {
    //constructor(private dataProvider: HttpDataProvider) {
    console.log("Initializing App Icons...");
    this.smokescreen = false;
    //let cookieItemStyles = this.cookieService.getObject('homeItemStyles');
    /*
    if (cookieItemStyles) {
      console.log(cookieItemStyles);
      this.itemStyles = cookieItemStyles;
    } else {
      this.itemStyles = {};
    }
*/

    this.apps = new Array();
    //this.getData("");
    this.apps.push(
      new App(
        "Ionic App",
        "https://codecraft.tv",
        //this.sanitizer.bypassSecurityTrustResourceUrl("https://codecraft.tv"),
        AppStatus.Up,
        "/assets/imgs/vis-app.png"
      )
    ); // this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:8100"),
    this.apps.push(
      new App(
        "AOI Machine",
        "https://codecraft.tv",
        //this.sanitizer.bypassSecurityTrustResourceUrl("https://codecraft.tv"),
        AppStatus.Up,
        "/assets/imgs/machine-app.png",
        "right"
      )
    ); // this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:3000"),
    this.apps.push(
      new App("test-app", "localhost:3000/", AppStatus.Down)
    );
    this.apps.push(
      new App("test-app2", "localhost:3000/", AppStatus.Warning)
    );
    this.apps.push(new App("test-app3", "localhost:8100"));

    this.itemStyles = new Array(this.apps.length);
    for (let i = 0; i < this.itemStyles.length; i++) {
      this.itemStyles[i] = {transform: ""};
    }
  }

  ngAfterViewInit() {


  }

  public log(text: string) {
    console.log(text);
  }

  public hideMe(event) {
    this.log("called hideMe");
    let result = false;
    this.apps.forEach(app => {
      if (app.previewing == true) result = true;
    });
    this.smokescreen = result;

    var target = event.target || event.srcElement;
    if (this.smokescreen) {
      target.style.visibility = "visible";
    } else {
      target.style.visibility = "hidden";
    }
  }

  public previewHandler(app: App) {
    document.getElementById("smoke-screen").style.visibility = "visible";
    app.previewToggle();
  }

  delete(app: App) {
    var index = this.indexOfApp(app);
    if (index > -1) {
      this.chosenApps.splice(index, 1);
    }
    if (this.chosenApps != null) {
      for (let i = 0; i < this.chosenApps.length; i++) {
        console.log("delete " + index + this.chosenApps[i].name);
      }
    }

  }

  indexOfApp(app: App): number {
    let index = -1;
    for (let i = 0; i < this.chosenApps.length; i++) {
      if (app.name == this.chosenApps[i].name) {
        index = i;
      }
    }
    return index;
  }

  saveStyle(event, item) {
    console.log(item);
    this.itemStyles[item] = {transform: event.style.transform};
    this.positionArray = JSON.stringify(this.itemStyles);

    console.log("end " + this.itemStyles[item].transform);
    //this.cookieService.putObject('homeItemStyles', this.itemStyles);
  }

  getStyle(item) {

    var position = JSON.parse(this.positionArray);
    //console.log({"transform":position[item]+"!important"});
    return {'transform':position[item]};
  }

  saveSomeData(array: Array<any>) {
    //this.localStorageService.set('positionArray', JSON.stringify(array));
  }

  /*
  getData(path: string) {
    let dataObserver = this.dataProvider.getData(path);

    dataObserver.subscribe(dataFromProvider => {
      console.log("Data received:" + dataFromProvider);

      this.apps = dataFromProvider["node"]["nodes"].map(x => ({
        key: x["key"].split("/")[2],
        nodes: x["nodes"]
          .filter(x => x["value"] != "")
          .map(x => ({ key: x["key"].split("/")[3], value: x["value"] }))
      }));

      let myapps: App[] = new Array();
      this.apps.forEach(app => {
        let myapp: App = new App();

        // use a map and make it nicer
        let title = app["nodes"].filter(x => x["key"] === "title");
        let iconUrl = app["nodes"].filter(x => x["key"] === "iconUrl");
        let userUrl = app["nodes"].filter(x => x["key"] === "userUrl");
        let name = app["nodes"].filter(x => x["key"] === "name");
        // myapp.push(title);
        // map(x => ({key: x["key"], }))
        if (title[0]) myapp.name = title[0]["value"];
        if (name[0]) myapp.iconLocalHelper = name[0]["value"];
        if (iconUrl[0]) myapp.imgUrl = iconUrl[0]["value"];
        if (userUrl[0]) myapp.url = this.sanitizer.bypassSecurityTrustResourceUrl(userUrl[0]["value"]);

        myapp.status = AppStatus.Up;
        myapp.updateMissingRemoteIcons();
        myapps.push(myapp);
      });
      this.apps = myapps;
      // console.log("Data filtered:" + this.testData);
    });
  }*/
}
