export interface Book {
  _id: string;
  isbn10: string;
  isbn13: string;
  title: string;
  subtitle: string;
  originalTitle: string;
  foreignKeys: { publisherId: string; collectionId: string | null };
  language: string;
  originalLanguage: string;
  publicInformation: {
    publicationDate: Date;
    edition: string;
    editionNumber: number;
    printingDate: Date;
    printingNumber: string;
  };
  content: {
    synopsis: string;
    pageCount: number;
    dimensions: { height: number | null; width: number | null; weight: number | null };
  };
  commercialInfo: {
    price: number;
    barcode: string;
    stockQuantity: number;
    status: "ativo" | "inativo" | string;
  };
  metadatas: { ageGroup: string; keywords: string[]; gender: string[] };
  createdAt: Date;
  updatedAt: Date;
}