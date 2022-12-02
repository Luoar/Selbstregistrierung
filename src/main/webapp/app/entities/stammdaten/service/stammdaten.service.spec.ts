import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStammdaten } from '../stammdaten.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stammdaten.test-samples';

import { StammdatenService } from './stammdaten.service';

const requireRestSample: IStammdaten = {
  ...sampleWithRequiredData,
};

describe('Stammdaten Service', () => {
  let service: StammdatenService;
  let httpMock: HttpTestingController;
  let expectedResult: IStammdaten | IStammdaten[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StammdatenService);
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

    it('should create a Stammdaten', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const stammdaten = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stammdaten).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Stammdaten', () => {
      const stammdaten = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stammdaten).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Stammdaten', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Stammdaten', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Stammdaten', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStammdatenToCollectionIfMissing', () => {
      it('should add a Stammdaten to an empty array', () => {
        const stammdaten: IStammdaten = sampleWithRequiredData;
        expectedResult = service.addStammdatenToCollectionIfMissing([], stammdaten);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stammdaten);
      });

      it('should not add a Stammdaten to an array that contains it', () => {
        const stammdaten: IStammdaten = sampleWithRequiredData;
        const stammdatenCollection: IStammdaten[] = [
          {
            ...stammdaten,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStammdatenToCollectionIfMissing(stammdatenCollection, stammdaten);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Stammdaten to an array that doesn't contain it", () => {
        const stammdaten: IStammdaten = sampleWithRequiredData;
        const stammdatenCollection: IStammdaten[] = [sampleWithPartialData];
        expectedResult = service.addStammdatenToCollectionIfMissing(stammdatenCollection, stammdaten);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stammdaten);
      });

      it('should add only unique Stammdaten to an array', () => {
        const stammdatenArray: IStammdaten[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stammdatenCollection: IStammdaten[] = [sampleWithRequiredData];
        expectedResult = service.addStammdatenToCollectionIfMissing(stammdatenCollection, ...stammdatenArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stammdaten: IStammdaten = sampleWithRequiredData;
        const stammdaten2: IStammdaten = sampleWithPartialData;
        expectedResult = service.addStammdatenToCollectionIfMissing([], stammdaten, stammdaten2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stammdaten);
        expect(expectedResult).toContain(stammdaten2);
      });

      it('should accept null and undefined values', () => {
        const stammdaten: IStammdaten = sampleWithRequiredData;
        expectedResult = service.addStammdatenToCollectionIfMissing([], null, stammdaten, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stammdaten);
      });

      it('should return initial array if no Stammdaten is added', () => {
        const stammdatenCollection: IStammdaten[] = [sampleWithRequiredData];
        expectedResult = service.addStammdatenToCollectionIfMissing(stammdatenCollection, undefined, null);
        expect(expectedResult).toEqual(stammdatenCollection);
      });
    });

    describe('compareStammdaten', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStammdaten(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStammdaten(entity1, entity2);
        const compareResult2 = service.compareStammdaten(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStammdaten(entity1, entity2);
        const compareResult2 = service.compareStammdaten(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStammdaten(entity1, entity2);
        const compareResult2 = service.compareStammdaten(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
