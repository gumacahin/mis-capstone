import { renderHook } from "@testing-library/react";
import type { DataProvider } from "ra-core";
import { describe, expect, it, vi } from "vitest";

import useDrfDataProvider, { getOrderingQuery } from "../useDrfDataProvider";

// Mocks
vi.mock("../queries", () => ({
  useApiClient: () =>
    vi.fn(() =>
      Promise.resolve({ data: { id: 123, foo: "bar" }, status: 200 }),
    ),
}));

describe("useDrfDataProvider", () => {
  const apiUrl = "/api";
  let dataProvider: DataProvider;

  beforeEach(() => {
    // dataProvider must be acquired from within a renderHook (to simulate React state)
    const { result } = renderHook(() => useDrfDataProvider(apiUrl));
    dataProvider = result.current;
  });

  it("returns expected data for getOne", async () => {
    const res = await dataProvider.getOne("thing", { id: 7 });
    expect(res.data).toEqual({ id: 123, foo: "bar" });
  });

  it.skip("calls getList successfully", async () => {
    // Should combine params into querystring for list requests.
    const params = {
      filter: { q: "searchterm", type: "example" },
      pagination: { page: 2, perPage: 25 },
      sort: { field: "foo", order: "ASC" },
    };
    const res = await dataProvider.getList("stuff", params);
    expect(res.data).toEqual({ id: 123, foo: "bar" });
  });

  it.skip("calls getMany and returns expected data", async () => {
    const res = await dataProvider.getMany("thing", { ids: [1, 2, 3] });
    expect(res.data).toEqual({ id: 123, foo: "bar" });
  });

  it("calls update", async () => {
    const res = await dataProvider.update("thing", {
      id: 42,
      data: { foo: "baz" },
      previousData: {},
    });
    expect(res.data).toEqual({ id: 123, foo: "bar" });
  });

  it("calls create", async () => {
    const res = await dataProvider.create("thing", { data: { foo: "blip" } });
    expect(res.data).toEqual({ id: 123, foo: "bar" });
  });

  it.skip("calls delete", async () => {
    const res = await dataProvider.delete("thing", { id: 9, previousData: {} });
    expect(res.data).toEqual({ id: 123, foo: "bar" });
  });
});

describe("getOrderingQuery", () => {
  it("returns ordering param for ASC sort", () => {
    expect(getOrderingQuery({ field: "name", order: "ASC" })).toEqual({
      ordering: "name",
    });
  });

  it("returns ordering param for DESC sort", () => {
    expect(getOrderingQuery({ field: "id", order: "DESC" })).toEqual({
      ordering: "-id",
    });
  });
});
