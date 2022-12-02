import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IZDP } from '../zdp.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../zdp.test-samples';

import { ZDPService } from './zdp.service';

const requireRestSample: IZDP = {
  ...sampleWithRequiredData,
};

describe('ZDP Service', () => {
  let service: ZDPService;
  let httpMock: HttpTestingController;
  let expectedResult: IZDP | IZDP[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ZDPService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ZDP', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const zDP = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(zDP).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ZDP', () => {
      const zDP = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(zDP).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ZDP', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ZDP', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ZDP', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addZDPToCollectionIfMissing', () => {
      it('should add a ZDP to an empty array', () => {
        const zDP: IZDP = sampleWithRequiredData;
        expectedResult = service.addZDPToCollectionIfMissing([], zDP);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(zDP);
      });

      it('should not add a ZDP to an array that contains it', () => {
        const zDP: IZDP = sampleWithRequiredData;
        const zDPCollection: IZDP[] = [
          {
            ...zDP,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addZDPToCollectionIfMissing(zDPCollection, zDP);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ZDP to an array that doesn't contain it", () => {
        const zDP: IZDP = sampleWithRequiredData;
        const zDPCollection: IZDP[] = [sampleWithPartialData];
        expectedResult = service.addZDPToCollectionIfMissing(zDPCollection, zDP);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(zDP);
      });

      it('should add only unique ZDP to an array', () => {
        const zDPArray: IZDP[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const zDPCollection: IZDP[] = [sampleWithRequiredData];
        expectedResult = service.addZDPToCollectionIfMissing(zDPCollection, ...zDPArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const zDP: IZDP = sampleWithRequiredData;
        const zDP2: IZDP = sampleWithPartialData;
        expectedResult = service.addZDPToCollectionIfMissing([], zDP, zDP2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(zDP);
        expect(expectedResult).toContain(zDP2);
      });

      it('should accept null and undefined values', () => {
        const zDP: IZDP = sampleWithRequiredData;
        expectedResult = service.addZDPToCollectionIfMissing([], null, zDP, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(zDP);
      });

      it('should return initial array if no ZDP is added', () => {
        const zDPCollection: IZDP[] = [sampleWithRequiredData];
        expectedResult = service.addZDPToCollectionIfMissing(zDPCollection, undefined, null);
        expect(expectedResult).toEqual(zDPCollection);
      });
    });

    describe('compareZDP', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareZDP(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareZDP(entity1, entity2);
        const compareResult2 = service.compareZDP(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareZDP(entity1, entity2);
        const compareResult2 = service.compareZDP(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareZDP(entity1, entity2);
        const compareResult2 = service.compareZDP(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
