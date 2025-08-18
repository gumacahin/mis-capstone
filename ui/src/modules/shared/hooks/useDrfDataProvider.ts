import { AxiosResponse } from "axios";
import queryString from "query-string";
import {
  DataProvider,
  FilterPayload,
  Identifier,
  PaginationPayload,
  SortPayload,
} from "ra-core";

import { useApiClient } from "./queries";

const { stringify } = queryString;

const getPaginationQuery = (pagination: PaginationPayload) => {
  return {
    page: pagination.page,
    page_size: pagination.perPage,
  };
};

const getFilterQuery = (filter: FilterPayload) => {
  const { q: search, ...otherSearchParams } = filter;
  return {
    ...otherSearchParams,
    search,
  };
};

export const getOrderingQuery = (sort: SortPayload) => {
  const { field, order } = sort;
  return {
    ordering: `${order === "ASC" ? "" : "-"}${field}`,
  };
};

export default function useDrfDataProvider(apiUrl: string): DataProvider {
  const httpClient = useApiClient();
  const getOneJson = (resource: string, id: Identifier) =>
    httpClient(`${apiUrl}/${resource}/${id}/`).then(
      (response: AxiosResponse) => response.data,
    );

  return {
    getList: async (resource, params) => {
      const query = {
        ...getFilterQuery(params.filter),
        ...(params.pagination && getPaginationQuery(params.pagination)),
        ...(params.sort && getOrderingQuery(params.sort)),
      };
      const url = `${apiUrl}/${resource}/?${stringify(query)}`;

      const { data } = await httpClient(url);

      return {
        data: data.results,
        total: data.count,
      };
    },

    getOne: async (resource, params) => {
      const data = await getOneJson(resource, params.id);
      return { data };
    },

    getMany: (resource, params) => {
      return Promise.all(params.ids.map((id) => getOneJson(resource, id))).then(
        (data) => ({ data }),
      );
    },

    getManyReference: async (resource, params) => {
      const query = {
        ...getFilterQuery(params.filter),
        ...getPaginationQuery(params.pagination),
        ...getOrderingQuery(params.sort),
        [params.target]: params.id,
      };
      const url = `${apiUrl}/${resource}/?${stringify(query)}`;

      const { data } = await httpClient(url);
      return {
        data: data.results,
        total: data.count,
      };
    },

    update: async (resource, params) => {
      const { data } = await httpClient(`${apiUrl}/${resource}/${params.id}/`, {
        method: "PATCH",
        data: params.data,
      });
      return { data };
    },

    updateMany: (resource, params) =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}/`, {
            method: "PATCH",
            data: params.data,
          }),
        ),
      ).then((responses) => ({ data: responses.map(({ data }) => data.id) })),

    create: async (resource, params) => {
      const { data } = await httpClient(`${apiUrl}/${resource}/`, {
        method: "POST",
        data: JSON.stringify(params.data),
      });
      return {
        data: { ...data },
      };
    },

    delete: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}/`, {
        method: "DELETE",
      }).then(() => ({ data: params.previousData! })),

    deleteMany: (resource, params) =>
      Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}/`, {
            method: "DELETE",
          }),
        ),
      ).then(() => ({ data: [] })),
  };
}
