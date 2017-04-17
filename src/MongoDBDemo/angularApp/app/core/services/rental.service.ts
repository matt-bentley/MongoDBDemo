import { Configuration } from './../../app.constants';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { PostRental } from './../../models/post-rental';
import { Image } from './../../models/image';
import { Rental } from './../../models/rental';
import { AdjustPrice } from './../../models/adjust-price';
import { RentalsFilter } from './../../models/rentals-filter';

@Injectable()
export class RentalService {

    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http, private configuration: Configuration) {

        this.actionUrl = configuration.Server + 'api/rentals/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public getAll = (): Observable<Array<Rental>> => {
        return this.http.get(this.actionUrl, { headers: this.headers }).map(res => <Array<Rental>>res.json());
    }

    public getFiltered = (filters: RentalsFilter): Observable<Array<Rental>> => {
        let toAdd = JSON.stringify(filters);

        return this.http.post(`${this.actionUrl}GetFiltered/`, toAdd, { headers: this.headers }).map(res => <Array<Rental>>res.json());
    }

    public getRental = (id: string): Observable<Rental> => {
        return this.http.get(this.actionUrl + id, { headers: this.headers }).map(res => <Rental>res.json());
    }

    public insert = (postRental: PostRental): Observable<PostRental> => {
        let toAdd = JSON.stringify(postRental);

        return this.http.post(this.actionUrl, toAdd, { headers: this.headers }).map(res => <PostRental>res.json());
    }

    public deleteRental = (id: string): Observable<any> => {
        return this.http.delete(this.actionUrl + id, { headers: this.headers }).map(res => <any>res.json());
    }

    public adjustPrice = (id: string, adjustPrice: AdjustPrice): Observable<AdjustPrice> => {
        let toAdd = JSON.stringify(adjustPrice);

        return this.http.post(`${this.actionUrl}AdjustPrice/${id}`, toAdd, { headers: this.headers }).map(res => <AdjustPrice>res.json());
    }

    public uploadImage(id: string, fileToUpload: any) {
        let input = new FormData();
        input.append("file", fileToUpload);

        return this.http
            .post(`${this.actionUrl}AddImage/${id}`, input);
    }

    public getImage = (id: string): Observable<Image> => {
        return this.http.get(this.actionUrl + "GetImage/" + id, { headers: this.headers }).map(res => <Image>res.json());
    }
}