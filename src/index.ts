import { Observable, from } from "rxjs";
import { map, tap, mergeMap } from "rxjs/operators";
import { fetch } from "cross-fetch";
import { makeCodec } from "@huehuejs/name-convention/codec";
import { NameConventions } from "@huehuejs/name-convention/convention"
import { Type } from "@huehuejs/x-data"
import { makeFromRecipe, makeFromObjectRecipe, makeFromFunction, toArray } from "@huehuejs/x-data/parser"

const host = 'swapi.co'
const basePath = '/api'

const codec = makeCodec(
    NameConventions.LowerCammelCase,
    NameConventions.LowerSnakeCase
)

export class Planet {
    name: string//"Tatooine"
    rotationPeriod: number//"23"
    orbitalPeriod: number//"304"
    diameter: number//"10465"
    climate: string//"arid"
    gravity: string//"1 standard"
    terrain: string//"desert"
    surfaceWater: number//"1"
    population: number//"200000"
    residents: Array<string>
    films: Array<string>
    created: Date//"2014-12-09T13:50:49.641000Z"
    edited: Date//"2014-12-21T20:48:04.175778Z"
    url: string//"https://swapi.co/api/planets/1/"
}


class LazyResource<E extends object> implements ProxyHandler<E> {
    constructor(
        protected source: string,
        protected origin: any,
        protected resourceType: Type<E>
    ) {

    }

    get() {

    }
}

const peopleUrl = makeFromFunction(url => {
    return new LazyResource(url, url, Object);
})

const planetParser = makeFromObjectRecipe({
    target: Planet,
    nestedTargets: {
        rotationPeriod: makeFromFunction((it: string) => parseInt(it)),
        orbitalPeriod: makeFromFunction((it: string) => parseInt(it)),
        diameter: makeFromFunction((it: string) => parseInt(it)),
        surfaceWater: makeFromFunction((it: string) => parseInt(it)),
        population: makeFromFunction((it: string) => parseInt(it)),
        created: makeFromFunction((it: string) => new Date(it)),
        edited: makeFromFunction((it: string) => new Date(it)),
        residents: toArray(peopleUrl),
    }
})

export const getPlanet = (id: number): Observable<Planet> => {
    const request = fetch(`https://${host}${basePath}/planets/${id}/`)
    return from(request).pipe(
        mergeMap(response => from(response.json())),
        map(it => codec.decode(it)),
        map(it => planetParser(it)),
        tap(it => console.debug(it.surfaceWater, typeof it.surfaceWater)),
    )
}