import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const phrases = [
  {
    title: "Share Your Knowledge.",
    desc: "Join thousands of passionate instructors and inspire learners around the world."
  },
  {
    title: "Teach. Inspire. Grow.",
    desc: "Create engaging courses and help students achieve their goals."
  },
  {
    title: "Become an Instructor.",
    desc: "Turn your expertise into impactful learning experiences."
  },
  {
    title: "Shape Future Professionals.",
    desc: "Empower students with practical skills for tomorrow."
  }
];

const TeachOn = () => {
  const [current, setCurrent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      image: user?.photoURL || "",
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let resumeUrl = "";

      if (data.resumeFile && data.resumeFile[0]) {
        const file = data.resumeFile[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "teacher_resumes");
        formData.append("resource_type", "raw");

        const cloudName = "dcm72pffx";

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudData = await cloudRes.json();

        if (!cloudRes.ok) {
          throw new Error(cloudData.error?.message || "Failed to upload resume PDF");
        }

        resumeUrl = cloudData.secure_url;
      }

      const applicationData = {
        name: data.name,
        email: data.email,
        image: data.image,
        phone: data.phone || "",
        portfolio: data.portfolio || "",
        experience: data.experience,
        category: data.category,
        title: data.title,
        bio: data.bio,
        resume: resumeUrl,
        status: "pending",
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/teacher-applications", applicationData);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your application is under review by an administrator.",
          confirmButtonColor: "#2563EB",
        });
        reset();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.response?.data?.message || error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-24 font-sans">
      <Helmet>
        <title>EdCare | TeachOn</title>
      </Helmet>
      <div className="min-h-screen relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3209298/3209298-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-8 py-10 gap-10">
          <div className="flex-1 text-white max-w-xl text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 sm:mb-8">
              Teach<span className="text-blue-500">On</span>
            </h1>

            <div className="transition-all duration-500">
              <h2 className="text-2xl sm:text-5xl font-bold leading-tight mb-4 sm:mb-6">
                {phrases[current].title}
              </h2>

              <p className="text-sm sm:text-lg text-gray-300 leading-relaxed sm:leading-8">
                {phrases[current].desc}
              </p>
            </div>
          </div>

          <div className="w-full max-w-xl bg-white rounded-3xl sm:rounded-[40px] shadow-2xl p-6 sm:p-10 text-gray-800">
            <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">Teacher Application</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Full Name"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm"
              />

              <input
                type="email"
                {...register("email")}
                readOnly
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
              />

              <input
                type="text"
                {...register("image", { required: true })}
                placeholder="Photo URL"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm"
              />

              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1 ml-4 font-semibold">
                  Upload Resume / CV (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  {...register("resumeFile", { required: true })}
                  className="w-full px-6 py-2.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="Phone Number"
                  className="w-full px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm"
                />
                <input
                  type="url"
                  {...register("portfolio")}
                  placeholder="Portfolio / LinkedIn URL"
                  className="w-full px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  {...register("experience", { required: true })}
                  className="px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Experience Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="mid-level">Mid-Level</option>
                  <option value="experienced">Experienced</option>
                </select>

                <select
                  {...register("category", { required: true })}
                  className="px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI">AI</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Professional Title (e.g. Senior MERN Developer)"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm"
              />

              <textarea
                {...register("bio", { required: true })}
                placeholder="Briefly describe your background and experience..."
                rows="3"
                className="w-full px-6 py-3.5 border border-gray-300 rounded-2xl outline-none focus:border-blue-500 text-sm resize-none"
              ></textarea>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold transition duration-300 cursor-pointer ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? "Uploading & Submitting..." : "Submit For Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachOn;