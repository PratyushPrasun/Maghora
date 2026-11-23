"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useAdminCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const variantSchema = z
  .object({
    sku: z.string().trim().min(2, "SKU required").max(40),
    weightGrams: z.number().int().positive("Weight in grams required"),
    price: z.number().positive("Selling price (₹) must be greater than 0"),
    mrp: z.number().positive("MRP (₹) must be greater than 0"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    isActive: z.boolean(),
  })
  .refine((variant) => variant.mrp >= variant.price, {
    message: "MRP cannot be lower than selling price",
    path: ["mrp"],
  });

const createProductSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(120),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a valid category"),
  shortDescription: z.string().trim().max(250).optional(),
  description: z.string().trim().min(10, "Description must be at least 10 chars").max(5000),
  isFeatured: z.boolean(),
  isBestseller: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one variant required"),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
});

type FormDataValues = z.infer<typeof createProductSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { data: categories } = useAdminCategories();
  const createProductMutation = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormDataValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      isFeatured: false,
      isBestseller: false,
      shortDescription: "",
      seoTitle: "",
      seoDescription: "",
      variants: [
        {
          sku: "MG-100G",
          weightGrams: 100,
          price: 249,
          mrp: 299,
          stock: 50,
          isActive: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const updateStock = (index: number, delta: number) => {
    const current = Number(watch(`variants.${index}.stock`)) || 0;
    const nextVal = Math.max(0, current + delta);
    setValue(`variants.${index}.stock`, nextVal, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 8) {
      toast.error("You can upload a maximum of 8 images per product.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (data: FormDataValues) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || "",
        category: data.category,
        variants: data.variants.map((v) => ({
          sku: v.sku.toUpperCase(),
          weightGrams: Number(v.weightGrams),
          // Convert rupees to paise for backend
          pricePaise: Math.round(Number(v.price) * 100),
          mrpPaise: Math.round(Number(v.mrp) * 100),
          stock: Number(v.stock),
          isActive: v.isActive,
        })),
        isFeatured: data.isFeatured,
        isBestseller: data.isBestseller,
        seo: {
          title: data.seoTitle || "",
          description: data.seoDescription || "",
        },
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await createProductMutation.mutateAsync(formData);
      router.push("/admin/products");
    } catch {
      // Handled in mutation hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
          Create New Makhana Product
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure product details, pack sizes, Cloudinary imagery, and initial inventory in Rupees (₹)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Product Name *</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Peri Peri Smoked Makhana"
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category *</Label>
              <select
                {...register("category")}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="">Select a category...</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2 p-4 rounded-2xl bg-muted/30 border border-border/60">
              <Label className="text-xs font-bold text-foreground">Badges & Merchandising</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    {...register("isFeatured")}
                    className="h-4 w-4 text-primary rounded mt-0.5 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-foreground cursor-pointer block">
                      Featured Product
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Displays a green "Featured" badge and prioritizes this item at the top of collections.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card">
                  <input
                    type="checkbox"
                    id="bestsellerCheckbox"
                    {...register("isBestseller")}
                    className="h-4 w-4 text-primary rounded mt-0.5 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="bestsellerCheckbox" className="text-xs font-semibold text-foreground cursor-pointer block">
                      Bestseller Product
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Displays a maroon "Bestseller" badge and highlights this item in the Bestselling Harvests section.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Short Catchline</Label>
              <Input
                {...register("shortDescription")}
                placeholder="e.g. Slow-roasted in olive oil with fiery African bird's eye chili."
                error={errors.shortDescription?.message}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Full Description *</Label>
              <Textarea
                {...register("description")}
                placeholder="Detailed tasting notes, ingredients, dietary specifications..."
                rows={4}
                error={errors.description?.message}
              />
            </div>
          </div>
        </div>

        {/* Variants & Inventory Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Flavour Variants & Pricing
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                All prices are entered in Rupees (₹). Adjust stock units using the +/- buttons or enter directly.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  sku: `MG-${Date.now().toString().slice(-4)}`,
                  weightGrams: 100,
                  price: 249,
                  mrp: 299,
                  stock: 50,
                  isActive: true,
                })
              }
              className="text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Variant
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl border border-border/80 bg-background space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Variant #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">SKU *</Label>
                    <Input
                      {...register(`variants.${index}.sku` as const)}
                      placeholder="SKU-100G"
                      className="uppercase font-mono text-xs h-9"
                    />
                    {errors.variants?.[index]?.sku && (
                      <p className="text-[10px] text-destructive">
                        {errors.variants[index]?.sku?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Weight (grams) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.weightGrams` as const, { valueAsNumber: true })}
                      placeholder="100"
                      className="text-xs h-9"
                    />
                    {errors.variants?.[index]?.weightGrams && (
                      <p className="text-[10px] text-destructive">
                        {errors.variants[index]?.weightGrams?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Price (₹) *</Label>
                    <Input
                      type="number"
                      step="any"
                      {...register(`variants.${index}.price` as const, { valueAsNumber: true })}
                      placeholder="249"
                      className="text-xs h-9 font-medium"
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-[10px] text-destructive">
                        {errors.variants[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">MRP (₹) *</Label>
                    <Input
                      type="number"
                      step="any"
                      {...register(`variants.${index}.mrp` as const, { valueAsNumber: true })}
                      placeholder="299"
                      className="text-xs h-9 font-medium"
                    />
                    {errors.variants?.[index]?.mrp && (
                      <p className="text-[10px] text-destructive">
                        {errors.variants[index]?.mrp?.message}
                      </p>
                    )}
                  </div>

                  {/* Initial Stock with +/- Controls */}
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <Label className="text-[11px]">Initial Stock *</Label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateStock(index, -1)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition-colors shrink-0"
                        title="Decrease stock"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <Input
                        type="number"
                        min={0}
                        {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                        placeholder="50"
                        className="text-xs h-9 text-center font-bold flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => updateStock(index, 1)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition-colors shrink-0"
                        title="Increase stock"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {errors.variants?.[index]?.stock && (
                      <p className="text-[10px] text-destructive">
                        {errors.variants[index]?.stock?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cloudinary Image Upload Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Product Photography (Cloudinary)
          </h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">
              Click to select or drag and drop images
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Supports JPG, PNG, WebP up to 5MB (Max 8 images)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="productImageUpload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 pointer-events-none"
            >
              Browse Files
            </Button>
          </div>

          {/* Previews */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-3">
              {filePreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl border border-border bg-muted overflow-hidden"
                >
                  <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-destructive transition-colors"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO Meta Tags Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Search Engine Optimization (SEO)
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Meta Title</Label>
              <Input
                {...register("seoTitle")}
                placeholder="e.g. Peri Peri Flavoured Makhana | Maghora"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Meta Description</Label>
              <Textarea
                {...register("seoDescription")}
                placeholder="Brief summary for Google search results (up to 160 characters)"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="lg" isLoading={createProductMutation.isPending} className="font-bold">
            Publish Product
          </Button>
        </div>
      </form>
    </div>
  );
}
