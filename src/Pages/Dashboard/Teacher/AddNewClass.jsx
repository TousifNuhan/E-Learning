import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { PlusCircle, Trash2, BookOpen, Layers, CheckCircle, ListChecks, ClipboardList } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddNewClass = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      teacherId: "",
      name: "",
      email: "",
      teacherImage: "",
      price: "",
      originalPrice: "",
      description: "",
      shortDescription: "",
      image: "",
      previewVideoUrl: "",
      category: "",
      duration: "12 weeks",
      language: "English",
      skillLevel: "Advanced",
      certificate: "Yes",
      instructorDetails: {
        title: "",
        bio: "",
      },
      objectives: [""],
      requirements: [""],
      modules: [
        {
          title: "",
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: "",
              duration: "",
              isFree: false,
              videoUrl: "",
            },
          ],
        },
      ],
    },
  });

  const watchedModules = useWatch({ control, name: "modules" });

  useEffect(() => {
    if (user) {
      setValue("teacherId", user._id || user.uid || "");
      setValue("name", user.displayName || user.name || "");
      setValue("email", user.email || "");
      setValue("teacherImage", user.photoURL || user.image || "");

      const existingTitle = user.title || user.designation || user.instructorDetails?.title || "";
      const existingBio = user.bio || user.instructorDetails?.bio || "";

      setValue("instructorDetails.title", existingTitle);
      if (existingBio) {
        setValue("instructorDetails.bio", existingBio);
      }
    }
  }, [user, setValue]);

  const { fields: moduleFields, append: appendModule, remove: removeModule } =
    useFieldArray({ control, name: "modules" });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({ control, name: "objectives" });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({ control, name: "requirements" });

  const handleAddLesson = (moduleIndex) => {
    const currentModules = getValues("modules") || [];
    const updatedModules = currentModules.map((mod, index) => {
      if (index === moduleIndex) {
        return {
          ...mod,
          lessons: [
            ...(mod.lessons || []),
            {
              id: `les-${Date.now()}-${Math.random()}`,
              title: "",
              duration: "",
              isFree: false,
              videoUrl: "",
            },
          ],
        };
      }
      return mod;
    });

    setValue("modules", updatedModules, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    const currentModules = getValues("modules") || [];
    const updatedModules = currentModules.map((mod, index) => {
      if (index === moduleIndex) {
        return {
          ...mod,
          lessons: mod.lessons.filter((_, idx) => idx !== lessonIndex),
        };
      }
      return mod;
    });

    setValue("modules", updatedModules, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);

    let calculatedLessonsCount = 0;
    data.modules.forEach((mod) => {
      calculatedLessonsCount += mod.lessons?.length || 0;
    });

    const cleanedObjectives = (data.objectives || []).filter((o) => o && o.trim() !== "");
    const cleanedRequirements = (data.requirements || []).filter((r) => r && r.trim() !== "");

    // Parse as integer so it saves cleanly without decimals
    const parsedPrice = Math.round(parseFloat(data.price)) || 0;
    const parsedOriginalPrice = Math.round(parseFloat(data.originalPrice)) || 0;

    const newClassData = {
      ...data,
      objectives: cleanedObjectives,
      requirements: cleanedRequirements,
      teacherId: user?._id || user?.uid || data.teacherId,
      name: user?.displayName || user?.name || data.name,
      email: user?.email || data.email,
      teacherImage: user?.photoURL || user?.image || data.teacherImage,
      instructorDetails: {
        title: user?.title || user?.designation || data.instructorDetails?.title || "",
        bio: data.instructorDetails?.bio || user?.bio || "",
      },
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      status: "pending",
      totalEnrollment: 0,
      totalReviews: 0,
      totalAssignments: 0,
      assignments: [],
      totalLessons: calculatedLessonsCount,
      totalHours: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/classes", newClassData);

      if (res.data?.insertedId || res.data?.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Course Submitted!",
          text: "Your new course has been submitted for review. You can create assignments in the course details page once approved.",
          confirmButtonColor: "#2563EB",
        });
        reset();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl my-8 font-sans">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4">
        Add New Course
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...register("teacherId")} />
        <input type="hidden" {...register("email")} />

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.photoURL ||
                user?.image ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
              }
              alt="Instructor"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-1">
                {user?.displayName || user?.name || "Instructor Name"}{" "}
                <CheckCircle size={16} className="text-blue-500" />
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.title || user?.designation || "Verified Instructor"} | {user?.email}
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium rounded-full">
            Verified Instructor
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Course Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="e.g. Advanced MERN Architecture & State Optimization"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">{errors.title.message}</span>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Category</label>
              <select
                {...register("category", { required: "Category selection is required" })}
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>
                  Category
                </option>
                <option value="Web Development">Web Development</option>
                <option value="AI">AI</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="DevOps">DevOps</option>
              </select>
              {errors.category && (
                <span className="text-red-500 text-sm">{errors.category.message}</span>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Price (৳)</label>
              <input
                {...register("price", { required: "Price is required" })}
                type="number"
                step="1"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="5400"
              />
              {errors.price && (
                <span className="text-red-500 text-sm">{errors.price.message}</span>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Original Price (৳)</label>
              <input
                {...register("originalPrice")}
                type="number"
                step="1"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="8000"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Duration</label>
              <input
                {...register("duration")}
                type="text"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="12 weeks"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Skill Level</label>
              <select
                {...register("skillLevel")}
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Language</label>
              <input
                {...register("language")}
                type="text"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Certificate Provided?</label>
              <select
                {...register("certificate")}
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 dark:text-gray-300">Short Description</label>
            <input
              {...register("shortDescription")}
              type="text"
              className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Brief course summary..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1 dark:text-gray-300">Full Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white resize-none"
              placeholder="Detailed overview..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Course Thumbnail Image URL</label>
              <input
                {...register("image")}
                type="text"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-300">Preview Video URL</label>
              <input
                {...register("previewVideoUrl")}
                type="text"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <ListChecks size={22} /> What You'll Learn (Objectives)
            </h3>
            <button
              type="button"
              onClick={() => appendObjective("")}
              className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              <PlusCircle size={18} /> Add Objective
            </button>
          </div>

          <div className="space-y-3">
            {objectiveFields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3">
                <input
                  {...register(`objectives.${idx}`)}
                  type="text"
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                  placeholder={`e.g. Build and deploy a full-stack MERN application`}
                />
                {objectiveFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(idx)}
                    className="text-red-500 hover:text-red-700 p-2 cursor-pointer shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <ClipboardList size={22} /> Requirements
            </h3>
            <button
              type="button"
              onClick={() => appendRequirement("")}
              className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              <PlusCircle size={18} /> Add Requirement
            </button>
          </div>

          <div className="space-y-3">
            {requirementFields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3">
                <input
                  {...register(`requirements.${idx}`)}
                  type="text"
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:text-white"
                  placeholder={`e.g. Basic knowledge of JavaScript and HTML/CSS`}
                />
                {requirementFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-red-500 hover:text-red-700 p-2 cursor-pointer shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Layers size={22} /> Course Curriculum (Modules & Lessons)
            </h3>
            <button
              type="button"
              onClick={() =>
                appendModule({
                  title: "",
                  lessons: [
                    {
                      id: `les-${Date.now()}`,
                      title: "",
                      duration: "",
                      isFree: false,
                      videoUrl: "",
                    },
                  ],
                })
              }
              className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              <PlusCircle size={18} /> Add Module
            </button>
          </div>

          {moduleFields.map((moduleItem, modIdx) => (
            <div
              key={moduleItem.id}
              className="p-5 border rounded-xl bg-gray-50/50 dark:bg-gray-800/50 space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <input
                  {...register(`modules.${modIdx}.title`)}
                  type="text"
                  className="w-full p-2.5 font-semibold border rounded-lg dark:bg-gray-800 dark:text-white text-base"
                  placeholder={`Module ${modIdx + 1} Title`}
                />
                {moduleFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeModule(modIdx)}
                    className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="pl-4 border-l-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <BookOpen size={16} /> Lessons
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleAddLesson(modIdx)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Add Lesson
                  </button>
                </div>

                {watchedModules?.[modIdx]?.lessons?.map((lesson, lesIdx) => (
                  <div
                    key={lesson.id || lesIdx}
                    className="p-3 border rounded-lg bg-white dark:bg-gray-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center"
                  >
                    <input
                      {...register(`modules.${modIdx}.lessons.${lesIdx}.title`)}
                      type="text"
                      className="p-2 border rounded text-xs dark:bg-gray-800 dark:text-white"
                      placeholder="Lesson Title"
                    />
                    <input
                      {...register(`modules.${modIdx}.lessons.${lesIdx}.duration`)}
                      type="text"
                      className="p-2 border rounded text-xs dark:bg-gray-800 dark:text-white"
                      placeholder="Duration (e.g. 15 mins)"
                    />
                    <input
                      {...register(`modules.${modIdx}.lessons.${lesIdx}.videoUrl`)}
                      type="text"
                      className="p-2 border rounded text-xs dark:bg-gray-800 dark:text-white"
                      placeholder="Video URL"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1 text-xs cursor-pointer dark:text-gray-300">
                        <input
                          type="checkbox"
                          {...register(`modules.${modIdx}.lessons.${lesIdx}.isFree`)}
                          className="rounded border-gray-300"
                        />
                        Free Preview
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg transition duration-300 cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting Course..." : "Submit Course For Review"}
        </button>
      </form>
    </div>
  );
};

export default AddNewClass;