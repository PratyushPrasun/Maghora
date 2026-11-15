"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesService, CreateAddressPayload, UpdateAddressPayload } from "@/services/addresses.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export const ADDRESS_KEYS = {
  all: ["addresses"] as const,
};

export function useAddresses() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: addresses,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ADDRESS_KEYS.all,
    queryFn: () => addressesService.getAddresses(),
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  });

  const createAddressMutation = useMutation({
    mutationFn: (payload: CreateAddressPayload) => addressesService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
      toast.success("Delivery address saved");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save address");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAddressPayload }) =>
      addressesService.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
      toast.success("Address updated");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update address");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => addressesService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
      toast.success("Default delivery address set");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update default address");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => addressesService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.all });
      toast.success("Address removed");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete address");
    },
  });

  return {
    addresses: addresses || [],
    isLoading: isLoading && Boolean(user),
    error,
    refetch,
    createAddress: createAddressMutation.mutateAsync,
    isCreating: createAddressMutation.isPending,
    updateAddress: updateAddressMutation.mutateAsync,
    isUpdating: updateAddressMutation.isPending,
    setDefaultAddress: setDefaultMutation.mutateAsync,
    deleteAddress: deleteAddressMutation.mutateAsync,
  };
}

