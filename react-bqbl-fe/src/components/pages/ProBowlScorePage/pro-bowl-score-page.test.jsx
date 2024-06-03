import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react";
import { MOCK_APP_STATE, MockApp, MockFirebase } from "../../../testing/mocks";
import { AppStateContext } from "../../AppState";
import { FirebaseContext } from "../../Firebase";
import ProBowlScoresPage from "./pro-bowl-score-page";
import { Provider } from "react-redux";
import store from "../../../redux/store";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0));

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

describe("ProBowlScoresPage", () => {
  it("renders mocked data", async () => {
    act(() => {
      let mockFb = new MockFirebase();
      mockFb.scores['3'] = mockFb.scores['1'];
      render(
        <AppStateContext.Provider value={[MOCK_APP_STATE]}>
          <FirebaseContext.Provider value={mockFb}>
            <MockApp year={"2023"} league={"nbqbl"}>
              <Provider store={store}>
                <ProBowlScoresPage />
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
       screen.logTestingPlaygroundURL();
    expect(screen.getByText(/Ryan/i)).toBeInTheDocument();
    expect(screen.getByText(/Trevor/i)).toBeInTheDocument();
    expect(screen.getAllByText(/total: 1028/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/total: 108/i)[0]).toBeInTheDocument();
  });
});
