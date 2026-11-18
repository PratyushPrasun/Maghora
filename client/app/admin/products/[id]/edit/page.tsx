"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Minus, Trash2, UploadCloud, X } from "lucide-react";
import { useAdminProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useAdminCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const variantSchema = z
  .object({
    variantId: z.string().optional(),
    sku: z.string().trim().min(2, "SKU required").max(40),
    weightGrams: z.number().int().positive("Weight must be greater than 0"),
    price: z.number().positive("Selling price (₹) must be greater than 0"),
    mrp: z.number().positive("MRP (₹) must be greater than 0"),
    stockOnHand: z.number().int().min(0, "Stock cannot be negative"),
    isActive: z.boolean(),
  })
  .refine((v) => v.mrp >= v.price, {
    message: "MRP cannot be lower than selling price",
    path: ["mrp"],
  });

const updateProductSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a category"),
  shortDescription: z.string().trim().max(250).optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one variant required"),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
});

type FormValues = z.infer<typeof updateProductSchema>;

export default function EditProductPage() {
  const params = useParams();
  const productId = (params?.id as string) || "";
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: currentProduct, isLoading: loadingProduct } = useAdminProduct(productId);
  const { data: categories } = useAdminCategories();
  const updateProductMutation = useUpdateProduct();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [removePublicIds, setRemovePublicIds] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      isFeatured: false,
      shortDescription: "",
      seoTitle: "",
      seoDescription: "",
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Populate form with existing product data
  useEffect(() => {
    if (currentProduct) {
      reset({
        name: currentProduct.name,
        category:
          typeof currentProduct.category === "object"
            ? (currentProduct.category as any)._id
            : currentProduct.category,
        shortDescription: currentProduct.shortDescription || "",
        description: currentProduct.description || "",
        isFeatured: currentProduct.isFeatured || false,
        seoTitle: currentProduct.seo?.title || "",
        seoDescription: currentProduct.seo?.description || "",
        variants:
          currentProduct.variants?.map((v) => ({
            variantId: v._id,
            sku: v.sku || "SKU-STD",
            weightGrams: v.weightGrams,
            // Convert paise to rupees for UI
            price: Number(((v.pricePaise ?? 0) / 100).toFixed(2)),
            mrp: Number(((v.mrpPaise ?? 0) / 100).toFixed(2)),
            stockOnHand: v.stockOnHand ?? 0,
            isActive: v.isActive !== false,
          })) || [],
      });
    }
  }, [currentProduct, reset]);

  const updateStock = (index: number, delta: number) => {
    const current = Number(watch(`variants.${index}.stockOnHand`)) || 0;
    const nextVal = Math.max(0, current + delta);
    setValue(`variants.${index}.stockOnHand`, nextVal, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const currentTotalImages =
      (currentProduct?.images?.length || 0) -
      removePublicIds.length +
      selectedFiles.length;

    if (currentTotalImages + files.length > 8) {
      toast.error("A product can have a maximum of 8 images.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);

    // Reset input value so same files can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePendingFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const toggleRemoveExistingImage = (publicId: string) => {
    setRemovePublicIds((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: any = {
        name: data.name,
        category: data.category,
        description: data.description,
        shortDescription: data.shortDescription || "",
        isFeatured: data.isFeatured,
        variants: data.variants.map((v) => ({
          ...(v.variantId ? { variantId: v.variantId } : {}),
          sku: v.sku.toUpperCase(),
          weightGrams: Number(v.weightGrams),
          // Convert rupees back to paise for backend
          pricePaise: Math.round(Number(v.price) * 100),
          mrpPaise: Math.round(Number(v.mrp) * 100),
          stockOnHand: Number(v.stockOnHand),
          isActive: v.isActive,
        })),
        seo: {
          title: data.seoTitle || "",
          description: data.seoDescription || "",
        },
      };

      if (removePublicIds.length > 0) {
        payload.removeImagePublicIds = removePublicIds;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await updateProductMutation.mutateAsync({
        id: productId,
        formData,
      });

      router.push("/admin/products");
    } catch {
      // Handled in mutation hook
    }
  };

  if (loadingProduct) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested product ID does not exist in the catalogue.
        </p>
        <Link href="/admin/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

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
          Edit Product: {currentProduct.name}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Update catalogue content, manage product images, and edit pricing & inventory in Rupees (₹)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Details */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Product Name *</Label>
              <Input {...register("name")} error={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category *</Label>
              <select
                {...register("category")}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
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

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Featured on Storefront?</Label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredEdit"
                  {...register("isFeatured")}
                  className="h-4 w-4 text-primary rounded"
                />
                <label htmlFor="featuredEdit" className="text-xs text-foreground cursor-pointer">
                  Featured Product
                </label>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Short Catchline</Label>
              <Input
                {...register("shortDescription")}
                placeholder="e.g. Slow-roasted in olive oil with fiery African bird's eye chili."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Full Description *</Label>
              <Textarea {...register("description")} rows={4} error={errors.description?.message} />
            </div>
          </div>
        </div>

        {/* Variants, Pricing (Rupees) & Quantity */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Variants, Pricing & Inventory
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
                  stockOnHand: 50,
                  isActive: true,
                })
              }
              className="text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add New Variant
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const isExisting = Boolean(field.variantId);
              return (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl border border-border/80 bg-background space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Variant #{index + 1} {isExisting ? "(Existing)" : "(New)"}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          {...register(`variants.${index}.isActive` as const)}
                          className="h-3.5 w-3.5 text-primary rounded"
                        />
                        <span>Active</span>
                      </label>

                      {!isExisting && fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                          title="Remove new variant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">SKU *</Label>
                      <Input
                        {...register(`variants.${index}.sku` as const)}
                        className="uppercase font-mono text-xs h-9"
                        placeholder="MG-100G"
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
                        {...register(`variants.${index}.weightGrams` as const, {
                          valueAsNumber: true,
                        })}
                        className="text-xs h-9"
                        placeholder="100"
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
                        placeholder="249"
                        {...register(`variants.${index}.price` as const, {
                          valueAsNumber: true,
                        })}
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
                        placeholder="299"
                        {...register(`variants.${index}.mrp` as const, {
                          valueAsNumber: true,
                        })}
                        className="text-xs h-9 font-medium"
                      />
                      {errors.variants?.[index]?.mrp && (
                        <p className="text-[10px] text-destructive">
                          {errors.variants[index]?.mrp?.message}
                        </p>
                      )}
                    </div>

                    {/* Quantity with +/- Controls */}
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <Label className="text-[11px]">Stock Quantity *</Label>
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
                          {...register(`variants.${index}.stockOnHand` as const, {
                            valueAsNumber: true,
                          })}
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
                      {errors.variants?.[index]?.stockOnHand && (
                        <p className="text-[10px] text-destructive">
                          {errors.variants[index]?.stockOnHand?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Photography & Cloudinary Management */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="pb-3 border-b border-border/60">
            <h2 className="text-base font-bold text-foreground">
              Product Images
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add new images from your computer or manage existing Cloudinary images
            </p>
          </div>

          {/* Existing images */}
          {currentProduct.images && currentProduct.images.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Existing Images:</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {currentProduct.images.map((img, idx) => {
                  const isMarked = img.publicId && removePublicIds.includes(img.publicId);
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                        isMarked ? "border-destructive opacity-40 grayscale" : "border-border"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || "Product image"}
                        className="w-full h-full object-cover"
                      />
                      {img.publicId && (
                        <button
                          type="button"
                          onClick={() => toggleRemoveExistingImage(img.publicId!)}
                          className={`absolute bottom-1 right-1 px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                            isMarked
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          }`}
                        >
                          {isMarked ? "Undo Remove" : "Remove"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload new images box */}
          <div className="pt-2 space-y-3">
            <Label className="text-xs font-semibold">Upload Additional Images:</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">
                Click to select or drag and drop images
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Supports JPG, PNG, WebP up to 5MB (Max 8 total images)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="editProductImageUpload"
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

            {/* New file previews */}
            {filePreviews.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-[11px] text-muted-foreground">New Images to Upload:</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {filePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl border border-border bg-muted overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePendingFile(idx);
                        }}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-destructive transition-colors"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            isLoading={updateProductMutation.isPending}
            className="font-bold"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
