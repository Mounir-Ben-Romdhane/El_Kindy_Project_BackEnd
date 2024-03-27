const assert = require('assert');
const sinon = require('sinon'); // For mocking Mongoose methods
// Dynamic import of the Course model using import()
const Course = import('../models/Course.js');
// Mocking the Course model methods
const mockCourseModel = sinon.stub(Course);

// Mock the data for testing
const testData = [
  { title: 'Course 1', description: 'Description for Course 1' },
  { title: 'Course 2', description: 'Description for Course 2' }
];

describe('Course Listing and Details API', () => {
  before(() => {
    // Stub the find method to resolve with test data
    mockCourseModel.find = sinon.stub().resolves(testData);
    // Stub the findById method to resolve with a single course from test data
    mockCourseModel.findById = sinon.stub().callsFake((id) => {
      const course = testData.find(course => course._id === id);
      return Promise.resolve(course);
    });
  });

  it('should list all courses successfully', async () => {
    const result = await Course.find();
    assert.deepStrictEqual(result, testData, 'The listed courses do not match the expected data');
  });

  it('should get course details by ID successfully', async () => {
    const courseId = '1234567890'; // Assuming a valid course ID
    const expectedCourse = testData.find(course => course._id === courseId);
    const result = await Course.findById(courseId);
    assert.deepStrictEqual(result, expectedCourse, 'The retrieved course details do not match the expected data');
  });

  it('should return undefined for non-existent course ID', async () => {
    const courseId = 'nonExistentId'; // Assuming a non-existent course ID
    const result = await Course.findById(courseId);
    assert.strictEqual(result, undefined, 'The result should be undefined for non-existent course ID');
  });
  
});