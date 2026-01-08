import Course from '../models/Course.js';
export const createCourse = async (req, res) => {
    try {
        const { title, description, price, tags } = req.body;
        const course = await Course.create({
            title,
            description,
            price,
            tags,
            instituteId: req.user.instituteId,
            createdBy: req.user._id,
        });
        res.status(201).json(course);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instituteId: req.user.instituteId });
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course)
            return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=courseController.js.map