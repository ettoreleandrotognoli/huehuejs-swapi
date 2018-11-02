import { expect } from 'chai';
import { getPlanet, Planet } from "../src/index";

describe('Test Planet API', () => {
    it('Get One', () => {
        getPlanet(1).subscribe(console.log)
    })
})