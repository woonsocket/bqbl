import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { MOCK_APP_STATE, MockApp, MockFirebase } from "../../../testing/mocks";
import { AppStateContext } from "../../AppState";
import { FirebaseContext } from "../../Firebase";
import TeamScorePage from "./team-score-page";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import { createRoot } from 'react-dom/client';

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0));

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("TeamScorePage", () => {
  it("renders mocked data", async () => {
    act(() => {
      createRoot(container).render(
        <AppStateContext.Provider value={[MOCK_APP_STATE]}>
          <FirebaseContext.Provider value={new MockFirebase()}>
            <MockApp year={"2023"} league={"nbqbl"}>
              <Provider store={store}>
                <TeamScorePage />
              </Provider>
            </MockApp>
          </FirebaseContext.Provider>
        </AppStateContext.Provider>,
        container
      );
    });
    await act(async () => {
      await wait();
    });
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL();
    // Test that NYJ is in there, as they should be!
    expect(screen.getByRole("heading", { name: /nyj/i })).toBeInTheDocument();
    expect(
      screen.getByText(/17\/29, 151 yd, 1 td, 3 int final/i)
    ).toBeInTheDocument();
  });
});
