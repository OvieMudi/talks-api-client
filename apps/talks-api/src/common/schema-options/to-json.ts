import { ToObjectOptions, Document } from 'mongoose';

export const toJsonOptions: ToObjectOptions = {
  virtuals: true,
  transform: (_, doc: any) => {
    delete doc._id;
    delete doc.__v;

    if (doc.title && doc.date === null) {
      doc.date = 'TBD';
    }
  },
};
