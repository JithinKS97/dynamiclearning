import workBookReducer, { getNewSlide } from "../../reducers/workbook";
import * as actions from "../../actions/workbook";
import { fabric } from "fabric";
import workbookReducer from "../../reducers/workbook";

const defaultState = {
  slides: [getNewSlide()],
  curSlide: 0,
};

describe("Workbook reducer tests", () => {
  it("adds a slide to the slides array", () => {
    const { slides } = workBookReducer(defaultState, actions.addSlide());
    expect(slides.length).toBe(2);
  });
  it("does not make slides array empty when we try to delete the only slide", () => {
    const { slides } = workBookReducer(defaultState, actions.deleteSlide(0));
    expect(slides.length).toBe(1);
  });
  it("correctly deletes a slide at an index", () => {
    let withThreeSlides = {
      slides: [getNewSlide(), getNewSlide(), getNewSlide()],
      curSlide: 1,
    };
    const fabricObj = new fabric.Rect({
      left: 100,
    });
    // Including a fabric object in 2nd slide
    withThreeSlides.slides[1].fabricObjects.push(fabricObj);
    const witTwoSlides = workBookReducer(
      withThreeSlides,
      actions.deleteSlide(1)
    );
    expect(witTwoSlides.slides.length).toBe(2);
    expect(witTwoSlides.slides[0].fabricObjects.length).toStrictEqual(0);
    expect(witTwoSlides.slides[1].fabricObjects.length).toStrictEqual(0);
  });
  it("deletes a slide when curSlide is at the last index and checks if curSlide is decremented", () => {
    const withTwoSlides = {
      slides: [getNewSlide(), getNewSlide()],
      curSlide: 1,
    };
    const { curSlide } = workBookReducer(withTwoSlides, actions.deleteSlide(1));
    expect(curSlide).toBe(0);
  });
  it("sets a fabric object in the current slide", () => {
    let withTwoSlides = {
      slides: [getNewSlide(), getNewSlide(), getNewSlide()],
      curSlide: 1,
    };
    const fabricObj = new fabric.Rect({
      left: 100,
    });
    const { slides } = workBookReducer(
      withTwoSlides,
      actions.setFabricObjectsInCurSlide([fabricObj])
    );
    expect(slides[1].fabricObjects[0].left).toBe(100);
  });
  it("adds an item to current slide", () => {
    let withThreeSlides = {
      slides: [getNewSlide(), getNewSlide(), getNewSlide()],
      curSlide: 1,
    };
    const { slides } = workbookReducer(
      withThreeSlides,
      actions.addItemInCurSlide(sampleSim, "sims")
    );
    expect(slides[1].sims.length).toBe(1);
    expect(slides[1].sims[0]).toStrictEqual(sampleSim);
  });
  it("updates an item in current slide", () => {
    let withThreeSlides = {
      slides: [getNewSlide(), getNewSlide(), getNewSlide()],
      curSlide: 1,
    };
    withThreeSlides.slides[1].sims.push(sampleSim);
    withThreeSlides.slides[1].sims.push(sampleSim);
    const { slides } = workBookReducer(
      withThreeSlides,
      actions.updateItemInCurSlide(
        {
          ...sampleSim,
          position: { x: 50, y: 70 },
        },
        1,
        "sims"
      )
    );
    expect(slides[1].sims[1].position.x).toBe(50);
    expect(slides[1].sims[1].position.y).toBe(70);
  });
  it("deletes an item in current slide", () => {
    let withTwoSlides = {
      slides: [getNewSlide(), getNewSlide()],
      curSlide: 1,
    };
    withTwoSlides.slides[1].sims.push(sampleSim);
    withTwoSlides.slides[1].sims.push(sampleSim);
    const { slides } = workBookReducer(
      withTwoSlides,
      actions.deleteItemInCurSlide(1, "sims")
    );
    expect(slides[1].sims.length).toBe(1);
  });
});

const sampleSim = {
  owner: "jithin",
  id: "random_id",
  position: {
    x: 0,
    y: 0,
  },
  size: {
    width: 640,
    height: 360,
  },
};
