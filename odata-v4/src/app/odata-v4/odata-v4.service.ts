import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
@Injectable()
export class ODataV4Service {
  constructor(private http:Http) { }
  resource<TModel>(name:string, model$odata:any=null) :ODataResource<TModel> {
    if (this.resourceCache[name] instanceof ODataResource) return this.resourceCache[name];
    return new ODataResource<TModel>(name, this.http, model$odata);
  }
  private resourceCache = {};

  api() {
    return this.http.get(ODataV4Service.apiRoot)
      .pipe(map(i=>{
        return i.json().value
      }));
  }
  static apiRoot = "";
}
export class ODataApiMetadata {
  "name": string;
  "kind": string;
  "url":  string;
}
export class ODataResource<TModel> {
constructor(public name:string, private http: Http, public model$odata=null) {
  if (!model$odata) this.model$odata = {};
}
registerItemAction(method:string, action:string) {
  this.model$odata[action] = (key:((d:TModel)=>any)|any='_id', query?:any, data?:TModel)=>{
    let keyId = data?data[typeof key === 'function'?key(data):key]:typeof key==='function'?key(query):key,
        url = "@api/@resource('@key')/@action"
                .replace(/@api/g,ODataV4Service.apiRoot)
                .replace(/@resource/g, this.name)
                .replace(/@action/g,action)
                .replace(/@key/g, keyId.toString());
    return this.http[method.toLowerCase()](url, data, {
        withCredentials:true
      })
      .map(rs=>rs.json());
  }
}
$count(query:ODataQuery): Observable<number> {
  let url = "@api/@resource/$count"
              .replace(/@api/g,ODataV4Service.apiRoot)
              .replace(/@resource/g, this.name);
  if (query) url += '?'+serialize(query);
  return this.http
    .get(url, {
      withCredentials:true
    })
    .pipe(map(rs=>rs.json()))
    .pipe(take(1));
}
create(data:TModel) {
  let url = "@api/@resource"
              .replace(/@api/g,ODataV4Service.apiRoot)
              .replace(/@resource/g, this.name);
  return this.http
    .post(url, filterStoredData(data), {
      withCredentials:true
    })
    .pipe(map(rs=>rs.json()));
}
update(data:TModel, key:((d:TModel)=>any)|any='_id') {
  let keyId = data[typeof key === 'function'?key(data):key],
      url = "@api/@resource('@key')"
              .replace(/@api/g,ODataV4Service.apiRoot)
              .replace(/@resource/g, this.name)
              .replace(/@key/g, keyId.toString());
  return this.http
    .put(url, filterStoredData(data), {
      withCredentials:true
    })
    .pipe(map(rs=>rs.json()));
}
single(key:any, query?:ODataQuery): Observable<TModel> {
  let url = "@api/@resource('@key')"
              .replace(/@api/g,ODataV4Service.apiRoot)
              .replace(/@resource/g, this.name)
              .replace(/@key/g, key.toString());
  if (query) url += '?'+serialize(query);
  return this.http
    .get(url, {
      withCredentials:true
    })
    .pipe(map(rs=>rs.json())).pipe(take(1))
    .pipe(map(rs=>{
      rs.$ = this.model$odata;
      //rs.forEach(r=>r.$ = this.model$odata);
      return rs;
    }));
}
query(query?:ODataQuery): Observable<TModel[]> {
  let url = "@api/@resource"
              .replace(/@api/g,ODataV4Service.apiRoot)
              .replace(/@resource/g, this.name);
  if (query) url += '?'+serialize(query);
  return this.http
    .get(url, {
      withCredentials:true
    })
    .pipe(map(rs=>rs.json().value))
    .pipe(map(rs=>{
      rs.forEach(r=>r.$=this.model$odata);
      return rs;
    }))
    .pipe(take(1));
}
remove(key:any) {
  let url = "@api/@resource('@key')"
              .replace(/@api/g,ODataV4Service.apiRoot)
              .replace(/@resource/g, this.name)
              .replace(/@key/g, key.toString());
  return this.http
    .delete(url, {
      withCredentials:true
    })
    .pipe(map(rs=>rs.json()))
    .pipe(take(1));
}
}
//https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
function serialize (obj, prefix?) {
var str = [], p;
for(p in obj) {
  if (obj.hasOwnProperty(p)) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
    str.push((v !== null && typeof v === "object") ?
      serialize(v, k) :
      encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
}
return str.join("&");
}
function filterStoredData<TModel>(data:TModel) {
var clone = JSON.parse(JSON.stringify(data));
if (clone.$) delete clone.$;
return clone;
}
export class ODataQuery {
$top?:number;
$skip?:number;
$filter?:string;
$orderBy?:string;
$select?:string;
}

export abstract class GenericManager<TModel> {
  constructor(
      protected resourceName: string,
      protected OData: ODataV4Service,
      protected model$odata:any = null
  ) { }
  protected resource = this.OData.resource<TModel>(this.resourceName, this.model$odata);

  list(query?:ODataQuery) : Observable<TModel[]> {
    return this.resource.query(query);
  }
  count(query?:ODataQuery) {
    return this.resource.$count(query);
  }
  one(itemId:string) : Observable<TModel>{
    return this.resource.single(itemId);
  }
  create(item:TModel) : Observable<TModel> {
    return this.resource.create(item);
  }
  update(item:TModel) : Observable<TModel> {
      return this.resource.update(item);
  }
  delete(itemId:string) : Observable<TModel> {
    return this.resource.remove(itemId);
  }
  abstract getCleanModel();
}